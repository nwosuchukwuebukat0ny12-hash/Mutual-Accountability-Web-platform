const express = require('express');
const router = express.Router();
const { submitCheckIn, approveCheckIn, getCheckInFeed, getCheckInHistory, addComment, addReaction, getPublicCheckIns } = require('../controllers/checkinController');
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

// @route   GET /api/checkins/history/:goalId
// @desc    Get check-in history for a specific goal
// @access  Private
router.get('/history/:goalId', protect, getCheckInHistory);

// @route   GET /api/checkins/public
// @desc    Get public check-in feed
// @access  Private
router.get('/public', protect, getPublicCheckIns);

// @route   POST /api/checkins/:id/comments
// @desc    Add a comment to a check-in
// @access  Private
router.post('/:id/comments', protect, addComment);

// @route   POST /api/checkins/:id/reactions
// @desc    Add a reaction to a check-in
// @access  Private
router.post('/:id/reactions', protect, addReaction);

module.exports = router;
