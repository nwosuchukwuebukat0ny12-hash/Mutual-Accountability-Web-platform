const express = require('express');
const router = express.Router();
const { createGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createGoalSchema } = require('../utils/validators');

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', protect, validate(createGoalSchema), createGoal);

module.exports = router;
