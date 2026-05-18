const CheckIn = require('../models/CheckIn');
const Goal = require('../models/Goal');
const User = require('../models/User');
const { formatInTimeZone } = require('date-fns-tz');
const { differenceInCalendarDays } = require('date-fns');

/**
 * @desc    Submit a check-in for a goal
 * @route   POST /api/checkins
 * @access  Private
 */
const createCheckIn = async (req, res) => {
  try {
    const { goalId, status, progress, note } = req.body;

    if (!goalId || !status) {
      return res.status(400).json({ success: false, message: 'goalId and status are required' });
    }

    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const userTimezone = req.user.timezone || 'UTC';
    const now = new Date();
    const todayStr = formatInTimeZone(now, userTimezone, 'yyyy-MM-dd');

    // 1. Prevent duplicate check-ins for the same day
    if (goal.lastCheckinAt) {
      const lastCheckinStr = formatInTimeZone(goal.lastCheckinAt, userTimezone, 'yyyy-MM-dd');
      if (lastCheckinStr === todayStr) {
        return res.status(400).json({ success: false, message: 'Already checked in for this goal today' });
      }
    }

    // 2. Dynamically calculate the streak (currentStreak, longestStreak)
    let user = await User.findById(req.user._id);
    let newCurrentStreak = user.currentStreak;

    if (user.lastActiveAt) {
      const lastActiveStr = formatInTimeZone(user.lastActiveAt, userTimezone, 'yyyy-MM-dd');
      
      if (lastActiveStr === todayStr) {
        // User already checked in for another goal today, streak remains the same
      } else {
        // We need to check if the last active date was exactly yesterday
        // To safely check date boundaries in local timezone, we parse the yyyy-MM-dd strings
        const [todayYear, todayMonth, todayDate] = todayStr.split('-').map(Number);
        const [lastYear, lastMonth, lastDate] = lastActiveStr.split('-').map(Number);
        
        const localToday = new Date(todayYear, todayMonth - 1, todayDate);
        const localLastActive = new Date(lastYear, lastMonth - 1, lastDate);

        const daysDifference = differenceInCalendarDays(localToday, localLastActive);

        if (daysDifference === 1) {
          // Checked in yesterday, streak continues!
          if (status !== 'missed') {
            newCurrentStreak += 1;
          } else {
            // missed checkin breaks streak
            newCurrentStreak = 0;
          }
        } else if (daysDifference > 1) {
          // Missed one or more days, streak resets
          newCurrentStreak = status !== 'missed' ? 1 : 0;
        }
      }
    } else {
      // First ever check-in
      newCurrentStreak = status !== 'missed' ? 1 : 0;
    }

    // Update longest streak if needed
    const longestStreak = Math.max(user.longestStreak, newCurrentStreak);

    // Update User
    user.currentStreak = newCurrentStreak;
    user.longestStreak = longestStreak;
    user.lastActiveAt = now;
    // Basic badge logic based on streak
    if (newCurrentStreak === 7 && !user.badges.includes('7_day_streak')) user.badges.push('7_day_streak');
    if (newCurrentStreak === 14 && !user.badges.includes('14_day_streak')) user.badges.push('14_day_streak');
    if (newCurrentStreak === 30 && !user.badges.includes('30_day_streak')) user.badges.push('30_day_streak');
    
    await user.save();

    // 3. Create the check-in record
    const checkIn = await CheckIn.create({
      goal: goalId,
      user: req.user._id,
      status,
      progress,
      note,
      streakAtTime: newCurrentStreak
    });

    // 4. Update Goal status and timestamps
    goal.lastCheckinAt = now;
    if (progress !== undefined) goal.progress = progress;
    if (progress === 100) {
      goal.status = 'completed';
      user.completedGoals += 1;
      await user.save();
    }
    
    // Calculate nextCheckinDue
    const { addDays } = require('date-fns');
    const { toDate } = require('date-fns-tz');
    const daysToAdd = goal.frequency === 'daily' ? 1 : goal.frequency === 'every2days' ? 2 : 7;
    let deadlineDate = addDays(now, daysToAdd);
    goal.nextCheckinDue = toDate(formatInTimeZone(deadlineDate, userTimezone, "yyyy-MM-dd'T'23:59:59.SSSXXX"), { timeZone: userTimezone });

    await goal.save();

    res.status(201).json({
      success: true,
      data: checkIn,
      streak: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      }
    });

  } catch (error) {
    console.error('Create CheckIn Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not process check-in',
    });
  }
};

module.exports = {
  createCheckIn,
};
