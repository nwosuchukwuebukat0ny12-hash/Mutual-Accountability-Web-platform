const CheckIn = require('../models/CheckIn');
const Goal = require('../models/Goal');
const Partnership = require('../models/Partnership');
const User = require('../models/User');
const { formatInTimeZone, toDate } = require('date-fns-tz');
const { differenceInCalendarDays, addDays } = require('date-fns');

// @route   POST /api/checkins/submit (or POST /api/checkins)
// @desc    Submit a check-in for a milestone/goal
// @access  Private
const submitCheckIn = async (req, res) => {
  try {
    const { goalId, note, stake, progress } = req.body;
    const userId = req.user._id;

    // 1. Verify that the goal exists and belongs to the current user
    const goal = await Goal.findOne({ _id: goalId, owner: userId });
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found or unauthorized',
      });
    }

    const userTimezone = req.user.timezone || 'UTC';
    const now = new Date();
    const todayStr = formatInTimeZone(now, userTimezone, 'yyyy-MM-dd');

    // 2. Prevent duplicate check-ins for the same day
    if (goal.lastCheckinAt) {
      const lastCheckinStr = formatInTimeZone(goal.lastCheckinAt, userTimezone, 'yyyy-MM-dd');
      if (lastCheckinStr === todayStr) {
        return res.status(400).json({
          success: false,
          message: 'Already submitted a check-in for this goal today',
        });
      }
    }

    // 3. Create the check-in with pending status
    const checkIn = await CheckIn.create({
      goal: goalId,
      user: userId,
      note,
      stake,
      progress: progress !== undefined ? progress : goal.progress,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Check-in submitted successfully, waiting for partner approval',
      data: checkIn,
    });
  } catch (error) {
    console.error('Error in submitCheckIn:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during check-in submission',
    });
  }
};

// @route   POST /api/checkins/approve/:id
// @desc    Verify and approve a partner's check-in (triggers streak calculation)
// @access  Private
const approveCheckIn = async (req, res) => {
  try {
    const checkInId = req.params.id;
    const partnerId = req.user._id;

    // 1. Find the check-in
    const checkIn = await CheckIn.findById(checkInId);
    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found',
      });
    }

    // 2. Check if already approved
    if (checkIn.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Check-in has already been approved',
      });
    }

    // 3. Verify partnership exists and is active between check-in owner and current user (partner)
    const partnership = await Partnership.findOne({
      $or: [
        { requester: checkIn.user, recipient: partnerId },
        { recipient: checkIn.user, requester: partnerId },
      ],
      status: 'active',
    });

    if (!partnership) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this check-in. Active partnership required.',
      });
    }

    // 4. Update check-in status
    checkIn.status = 'approved';
    checkIn.partnerApproval = {
      approved: true,
      approvedAt: new Date(),
      approvedBy: partnerId
    };
    await checkIn.save();

    // 5. Update goal's lastCheckinAt, progress, and status
    const goal = await Goal.findById(checkIn.goal);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal associated with check-in not found',
      });
    }

    const now = new Date();
    goal.lastCheckinAt = now;
    if (checkIn.progress !== undefined) goal.progress = checkIn.progress;

    // 6. Dynamically calculate the streak for the check-in OWNER
    const checkinOwner = await User.findById(checkIn.user);
    const userTimezone = checkinOwner.timezone || 'UTC';
    const todayStr = formatInTimeZone(now, userTimezone, 'yyyy-MM-dd');
    let newCurrentStreak = checkinOwner.currentStreak;

    // Check if this is the user's first ever approved check-in
    const otherApprovedCount = await CheckIn.countDocuments({
      user: checkIn.user,
      status: 'approved',
      _id: { $ne: checkIn._id }
    });

    if (otherApprovedCount > 0 && checkinOwner.lastActiveAt) {
      const lastActiveStr = formatInTimeZone(checkinOwner.lastActiveAt, userTimezone, 'yyyy-MM-dd');
      
      if (lastActiveStr === todayStr) {
        // User already active today, streak remains unchanged
      } else {
        const [todayYear, todayMonth, todayDate] = todayStr.split('-').map(Number);
        const [lastYear, lastMonth, lastDate] = lastActiveStr.split('-').map(Number);
        
        const localToday = new Date(todayYear, todayMonth - 1, todayDate);
        const localLastActive = new Date(lastYear, lastMonth - 1, lastDate);

        const daysDifference = differenceInCalendarDays(localToday, localLastActive);

        if (daysDifference === 1) {
          // Checked in yesterday, streak continues!
          newCurrentStreak += 1;
        } else if (daysDifference > 1) {
          // Missed one or more days, streak resets
          newCurrentStreak = 1;
        }
      }
    } else {
      // First ever approved check-in
      newCurrentStreak = 1;
    }

    // Safety Net: if currentStreak is 0 but we have approved check-ins, it must be at least 1!
    if (newCurrentStreak === 0) {
      newCurrentStreak = 1;
    }

    // Update longest streak
    const longestStreak = Math.max(checkinOwner.longestStreak, newCurrentStreak);

    // Update check-in owner profile
    checkinOwner.currentStreak = newCurrentStreak;
    checkinOwner.longestStreak = longestStreak;
    checkinOwner.lastActiveAt = now;

    // Badge triggers
    if (newCurrentStreak === 7 && !checkinOwner.badges.includes('7_day_streak')) checkinOwner.badges.push('7_day_streak');
    if (newCurrentStreak === 14 && !checkinOwner.badges.includes('14_day_streak')) checkinOwner.badges.push('14_day_streak');
    if (newCurrentStreak === 30 && !checkinOwner.badges.includes('30_day_streak')) checkinOwner.badges.push('30_day_streak');
    
    // Check if goal is fully completed (100% progress)
    if (goal.progress === 100) {
      goal.status = 'completed';
      checkinOwner.completedGoals += 1;
    }

    await checkinOwner.save();

    // Calculate nextCheckinDue for the goal
    const daysToAdd = goal.frequency === 'daily' ? 1 : goal.frequency === 'every2days' ? 2 : 7;
    const deadlineDate = addDays(now, daysToAdd);
    goal.nextCheckinDue = toDate(formatInTimeZone(deadlineDate, userTimezone, "yyyy-MM-dd'T'23:59:59.SSSXXX"), { timeZone: userTimezone });

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Check-in approved successfully! Partner pulse and streaks updated.',
      data: checkIn,
      streak: {
        currentStreak: checkinOwner.currentStreak,
        longestStreak: checkinOwner.longestStreak
      }
    });
  } catch (error) {
    console.error('Error in approveCheckIn:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during check-in approval',
    });
  }
};

/**
 * @desc    Get check-in feed for active partnerships (pending partner approval)
 * @route   GET /api/checkins/feed
 * @access  Private
 */
const getCheckInFeed = async (req, res) => {
  try {
    // Find active partnerships first
    const activePartnerships = await Partnership.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: 'active'
    })
    .populate('requester', 'name username')
    .populate('recipient', 'name username');

    if (!activePartnerships || activePartnerships.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Determine the partner IDs and build a name map
    const partnerIds = [];
    const partnerNameMap = {};

    activePartnerships.forEach(active => {
      const isRequester = active.requester._id.toString() === req.user._id.toString();
      const partner = isRequester ? active.recipient : active.requester;
      partnerIds.push(partner._id);
      partnerNameMap[partner._id.toString()] = partner.name;
    });

    // Find recent checkins by the partners that need approval, or were recently approved
    const checkIns = await CheckIn.find({
      user: { $in: partnerIds },
      // Either pending, or approved in the last 48 hours for history
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('goal', 'title category');

    const feedItems = checkIns.map(c => ({
      id: c._id.toString(),
      checkInId: c._id.toString(),
      partnerName: partnerNameMap[c.user.toString()] || "Partner",
      action: "completed a check-in",
      goalTitle: c.goal?.title || "Goal",
      timestamp: new Date(c.createdAt).toLocaleDateString(),
      note: c.note,
      approved: c.status === 'approved',
      isBadge: false
    }));

    res.status(200).json({ success: true, data: feedItems });
  } catch (error) {
    console.error('Get Checkin Feed Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving feed' });
  }
};

module.exports = {
  submitCheckIn,
  approveCheckIn,
  getCheckInFeed,
};
