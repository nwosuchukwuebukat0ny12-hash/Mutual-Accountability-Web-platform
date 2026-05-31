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
    const status = req.query.status;
    const query = { owner: req.user._id };
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }
    const goals = await Goal.find(query);
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
    const goalId = req.params.goalId || req.params.id;
    let milestoneIndex = req.params.milestoneIndex;
    
    // Support body index for backward compatibility with old route
    if (milestoneIndex === undefined) {
      milestoneIndex = req.body.milestoneIndex;
    }

    const idx = parseInt(milestoneIndex, 10);
    if (isNaN(idx) || idx < 0) {
      return res.status(400).json({ success: false, message: 'milestoneIndex must be a non-negative integer' });
    }

    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (idx >= goal.milestones.length) {
      return res.status(400).json({ success: false, message: 'Invalid milestone index' });
    }

    const currentCompleted = goal.milestones[idx].completed;
    const newCompleted = !currentCompleted;

    // Recalculate progress
    const completedMilestonesCount = goal.milestones.reduce((acc, m, i) => {
      const isCompleted = i === idx ? newCompleted : m.completed;
      return acc + (isCompleted ? 1 : 0);
    }, 0);

    const progress = goal.milestones.length > 0
      ? Math.round((completedMilestonesCount / goal.milestones.length) * 100)
      : 0;

    // Determine status and user stat changes
    let newStatus = goal.status;
    let userUpdate = null;

    if (progress === 100) {
      if (goal.status !== 'completed') {
        newStatus = 'completed';
        userUpdate = { $inc: { completedGoals: 1 } };
      }
    } else {
      if (goal.status === 'completed') {
        newStatus = 'active';
        userUpdate = { $inc: { completedGoals: -1 } };
      }
    }

    // Perform Mongoose atomic update
    const completedPath = `milestones.${idx}.completed`;
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: goalId, owner: req.user._id },
      { 
        $set: { 
          [completedPath]: newCompleted,
          progress,
          status: newStatus
        } 
      },
      { new: true }
    );

    // Increment or decrement the completedGoals streak/stats on the User schema if needed
    if (userUpdate) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, userUpdate);
    }

    res.status(200).json({
      success: true,
      data: updatedGoal,
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
