const express = require('express');
const router = express.Router();
const { createGoal, getGoals, toggleMilestone } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createGoalSchema } = require('../utils/validators');

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
