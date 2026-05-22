const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth'); // Actual path in the codebase

// @route   GET /api/users/leaderboard
// @desc    Get top users by streak
// @access  Private
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
