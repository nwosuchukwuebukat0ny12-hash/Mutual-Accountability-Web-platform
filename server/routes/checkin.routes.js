const express = require('express');
const router = express.Router();
const { submitCheckIn, approveCheckIn, getCheckInFeed } = require('../controllers/checkinController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { submitCheckInSchema } = require('../utils/validators');

// @route   POST /api/checkins/submit
// @desc    Submit a check-in
// @access  Private
router.post('/submit', protect, validate(submitCheckInSchema), submitCheckIn);

// @route   POST /api/checkins (Fallback / backward compatibility route)
// @desc    Submit a check-in (supports both routes)
// @access  Private
router.post('/', protect, validate(submitCheckInSchema), submitCheckIn);

// @route   GET /api/checkins/feed
// @desc    Get check-in feed for active partnership
// @access  Private
router.get('/feed', protect, getCheckInFeed);

// @route   POST /api/checkins/approve/:id
// @desc    Verify and approve a partner's check-in
// @access  Private
router.post('/approve/:id', protect, approveCheckIn);

module.exports = router;
