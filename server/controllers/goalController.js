const Goal = require('../models/Goal');

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res) => {
  try {
    const { title, category, description, deadline, frequency } = req.body;

    // 1. Calculate nextCheckinDue based on frequency and user's timezone
    const { formatInTimeZone, toDate } = require('date-fns-tz');
    const { addDays, endOfDay } = require('date-fns');

    const userTimezone = req.user.timezone || 'UTC';
    
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

module.exports = {
  createGoal,
};
