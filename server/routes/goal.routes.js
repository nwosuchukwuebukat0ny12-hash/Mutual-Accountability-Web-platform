const express = require('express');
const router = express.Router();
const { createGoal } = require('../controllers/goalController');
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

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', protect, validate(createGoalSchema), createGoal);

module.exports = router;
