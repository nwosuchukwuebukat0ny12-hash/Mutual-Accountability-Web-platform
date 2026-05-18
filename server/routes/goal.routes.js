const express = require('express');
const router = express.Router();
const { createGoal, getGoals, toggleMilestone } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const { createGoalSchema } = require('../utils/validators');

// Middleware to validate request body with Zod
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: error.errors.map((e) => ({ field: e.path[0], message: e.message })),
    });
  }
};

// @route   GET /api/goals
// @desc    Get logged-in user's active goals
// @access  Private
router.get('/', protect, getGoals);

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', protect, validate(createGoalSchema), createGoal);

// @route   PUT /api/goals/:id/milestone
// @desc    Toggle a specific milestone's completion status
// @access  Private
router.put('/:id/milestone', protect, toggleMilestone);

module.exports = router;
