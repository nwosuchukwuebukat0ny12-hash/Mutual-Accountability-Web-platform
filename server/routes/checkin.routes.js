const express = require('express');
const router = express.Router();
const { createCheckIn } = require('../controllers/checkinController');
const { protect } = require('../middleware/auth');
const { checkInSchema } = require('../utils/validators');

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

// @route   POST /api/checkins
// @desc    Submit a check-in for a goal
// @access  Private
router.post('/', protect, validate(checkInSchema), createCheckIn);

module.exports = router;
