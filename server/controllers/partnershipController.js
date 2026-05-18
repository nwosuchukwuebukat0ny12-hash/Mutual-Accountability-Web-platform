const Partnership = require('../models/Partnership');
const User = require('../models/User');
const Goal = require('../models/Goal');

/**
 * @desc    Search for an accountability partner by username
 * @route   GET /api/partnerships/search
 * @access  Private
 */
const searchPartner = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const partner = await User.findOne({ username: username.toLowerCase().trim() })
      .select('name username avatar bio currentStreak categories');

    if (!partner) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Dynamic compatibility score calculation based on shared focus categories!
    const myCategories = req.user.categories || [];
    const partnerCategories = partner.categories || [];
    const shared = myCategories.filter(c => partnerCategories.includes(c));
    const baseCompatibility = 75;
    const mutualCompatibility = Math.min(99, baseCompatibility + (shared.length * 10) + Math.floor(Math.random() * 5));

    // Map to response format expected by Ebuka's custom UI cards
    const mappedUser = {
      _id: partner._id,
      name: partner.name,
      username: partner.username,
      avatar: partner.avatar,
      bio: partner.bio || "No bio set yet. Dedicated accountability seeker.",
      mutualCompatibility,
      focusCategories: partner.categories.length > 0 ? partner.categories : ["study", "habit"]
    };

    res.status(200).json({
      success: true,
      data: mappedUser,
    });
  } catch (error) {
    console.error('Search Partner Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not execute partner search',
    });
  }
};

/**
 * @desc    Send a partnership invitation
 * @route   POST /api/partnerships/invite
 * @access  Private
 */
const invitePartner = async (req, res) => {
  try {
    const { username, goalId } = req.body;

    if (!username || !goalId) {
      return res.status(400).json({ success: false, message: 'Username and goalId are required' });
    }

    // Prevent self-invitation
    if (username.toLowerCase() === req.user.username.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Cannot invite yourself' });
    }

    // Find the recipient user
    const recipient = await User.findOne({ username: username.toLowerCase() });
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify the goal exists and belongs to the requester
    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check if a partnership already exists for this goal and recipient
    const existingPartnership = await Partnership.findOne({
      goal: goalId,
      recipient: recipient._id,
      status: { $in: ['pending', 'active'] }
    });

    if (existingPartnership) {
      return res.status(400).json({ success: false, message: 'Partnership already exists or is pending' });
    }

    // Create the invitation
    const partnership = await Partnership.create({
      goal: goalId,
      requester: req.user._id,
      recipient: recipient._id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: partnership,
    });
  } catch (error) {
    console.error('Invite Partner Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not send invitation',
    });
  }
};

/**
 * @desc    Get pending received invitations
 * @route   GET /api/partnerships/pending
 * @access  Private
 */
const getPendingInvites = async (req, res) => {
  try {
    const invites = await Partnership.find({
      recipient: req.user._id,
      status: 'pending'
    })
    .populate('requester', 'name username avatar')
    .populate('goal', 'title category deadline');

    res.status(200).json({
      success: true,
      data: invites,
    });
  } catch (error) {
    console.error('Get Pending Invites Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not fetch pending invites',
    });
  }
};

/**
 * @desc    Respond to a partnership invitation
 * @route   POST /api/partnerships/respond
 * @access  Private
 */
const respondToInvite = async (req, res) => {
  try {
    const { partnershipId, action, partnerGoalId } = req.body;

    if (!partnershipId || !action) {
      return res.status(400).json({ success: false, message: 'partnershipId and action are required' });
    }

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be accept or reject' });
    }

    const partnership = await Partnership.findOne({
      _id: partnershipId,
      recipient: req.user._id,
      status: 'pending'
    });

    if (!partnership) {
      return res.status(404).json({ success: false, message: 'Pending invitation not found' });
    }

    if (action === 'accept') {
      partnership.status = 'active';
      partnership.startedAt = new Date();
      
      // Optionally link the recipient's goal
      if (partnerGoalId) {
        const partnerGoal = await Goal.findOne({ _id: partnerGoalId, owner: req.user._id });
        if (partnerGoal) {
          partnership.partnerGoal = partnerGoalId;
        }
      }
    } else if (action === 'reject') {
      partnership.status = 'declined';
    }

    await partnership.save();

    res.status(200).json({
      success: true,
      data: partnership,
    });
  } catch (error) {
    console.error('Respond to Invite Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not respond to invitation',
    });
  }
};

module.exports = {
  searchPartner,
  invitePartner,
  getPendingInvites,
  respondToInvite,
};
