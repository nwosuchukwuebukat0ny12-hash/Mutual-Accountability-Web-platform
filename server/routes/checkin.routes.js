const express = require('express');
const router = express.Router();
const { submitCheckIn, approveCheckIn } = require('../controllers/checkinController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { submitCheckInSchema } = require('../utils/validators');

// @route   POST /api/checkins/submit
// @desc    Submit a check-in
// @access  Private
router.post('/submit', protect, validate(submitCheckInSchema), submitCheckIn);

// @route   POST /api/checkins/approve/:id
// @desc    Verify and approve a partner's check-in
// @access  Private
router.post('/approve/:id', protect, approveCheckIn);

module.exports = router;
