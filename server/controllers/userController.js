const User = require('../models/User');

/**
 * @desc    Get leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Private
 */
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({
      username: { $not: /^test/i },
      email: { $not: /@test\.com$/i }
    })
      .sort({ currentStreak: -1 })
      .limit(20)
      .select('name username currentStreak longestStreak badges');

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving leaderboard' });
  }
};

/**
 * @desc    Get user stats (goals, pacts, etc)
 * @route   GET /api/users/me/stats
 * @access  Private
 */
const getMyStats = async (req, res) => {
  try {
    const Goal = require('../models/Goal');
    const Partnership = require('../models/Partnership');
    const CheckIn = require('../models/CheckIn');

    const activePacts = await Partnership.countDocuments({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: 'active'
    });
    
    const dissolvedPacts = await Partnership.countDocuments({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: 'dissolved'
    });

    const activeGoals = await Goal.countDocuments({ owner: req.user._id, status: 'active' });
    const completedGoals = await Goal.countDocuments({ owner: req.user._id, status: 'completed' });
    const failedGoals = await Goal.countDocuments({ owner: req.user._id, status: 'failed' });
    
    const totalVerifications = await CheckIn.countDocuments({
      user: req.user._id,
      status: 'approved'
    });

    res.status(200).json({
      success: true,
      data: {
        activePacts,
        dissolvedPacts,
        activeGoals,
        completedGoals,
        failedGoals,
        totalVerifications
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving stats' });
  }
};

module.exports = {
  getLeaderboard,
  getMyStats,
};
