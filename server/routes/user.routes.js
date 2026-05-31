const express = require('express');
const router = express.Router();
const { getLeaderboard, getMyStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth'); // Actual path in the codebase
const { auditUserStreak } = require('../middleware/streakAuditor');

// @route   GET /api/users/leaderboard
// @desc    Get top users by streak
// @access  Private
router.get('/leaderboard', protect, auditUserStreak, getLeaderboard);

// @route   GET /api/users/me/stats
// @desc    Get user stats (goals, pacts, etc)
// @access  Private
router.get('/me/stats', protect, auditUserStreak, getMyStats);

module.exports = router;
