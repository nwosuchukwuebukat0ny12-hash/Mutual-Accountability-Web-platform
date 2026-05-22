const User = require('../models/User');

/**
 * @desc    Get leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Private
 */
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ currentStreak: -1 })
      .limit(20)
      .select('name username currentStreak longestStreak badges');

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving leaderboard' });
  }
};

module.exports = {
  getLeaderboard,
};
