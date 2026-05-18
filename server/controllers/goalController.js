const Goal = require('../models/Goal');

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res) => {
  try {
    const { title, category, description, deadline, frequency, timezone, milestones } = req.body;

    // 1. Calculate nextCheckinDue based on frequency and user's timezone
    const { formatInTimeZone, toDate } = require('date-fns-tz');
    const { addDays, endOfDay } = require('date-fns');

    const userTimezone = timezone || req.user.timezone || 'UTC';
    
    // Get current time in user's timezone
    const now = new Date();
    
    // Calculate how many days to add based on frequency
    const daysToAdd = frequency === 'daily' ? 1 : frequency === 'every2days' ? 2 : 7;
    
    // Calculate the deadline: "End of the day" after the interval
    // Example: If daily, nextCheckinDue is tomorrow at 23:59:59 in user's timezone
    let deadlineDate = addDays(now, daysToAdd);
    let nextCheckinDue = toDate(formatInTimeZone(deadlineDate, userTimezone, "yyyy-MM-dd'T'23:59:59.SSSXXX"), { timeZone: userTimezone });

    // 2. Create the goal
    const goal = await Goal.create({
      owner: req.user._id,
      title,
      category,
      description,
      deadline: new Date(deadline),
      frequency,
      nextCheckinDue,
      milestones: milestones ? milestones.map(m => ({ title: m.title, targetDate: new Date(m.targetDate) })) : [],
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error('Create Goal Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not create goal',
    });
  }
};

/**
 * @desc    Get logged-in user's active goals
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ owner: req.user._id, status: 'active' });
    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error('Get Goals Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not fetch goals',
    });
  }
};

/**
 * @desc    Toggle a specific milestone's completion status
 * @route   PUT /api/goals/:id/milestone
 * @access  Private
 */
const toggleMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { milestoneIndex } = req.body;

    if (typeof milestoneIndex !== 'number') {
      return res.status(400).json({ success: false, message: 'milestoneIndex is required and must be a number' });
    }

    const goal = await Goal.findOne({ _id: id, owner: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (milestoneIndex < 0 || milestoneIndex >= goal.milestones.length) {
      return res.status(400).json({ success: false, message: 'Invalid milestone index' });
    }

    // Toggle milestone
    goal.milestones[milestoneIndex].completed = !goal.milestones[milestoneIndex].completed;

    // Recalculate progress based on milestones, if milestones exist
    if (goal.milestones.length > 0) {
      const completedMilestones = goal.milestones.filter((m) => m.completed).length;
      goal.progress = Math.round((completedMilestones / goal.milestones.length) * 100);
    }

    await goal.save();

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error('Toggle Milestone Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not update milestone',
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  toggleMilestone,
};
