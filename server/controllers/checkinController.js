const CheckIn = require('../models/CheckIn');
const Goal = require('../models/Goal');
const Partnership = require('../models/Partnership');

// @route   POST /api/checkins/submit
// @desc    Submit a check-in for a milestone/goal
// @access  Private
const submitCheckIn = async (req, res) => {
  try {
    const { goalId, note, stake } = req.body;
    const userId = req.user._id;

    // 1. Verify that the goal exists and belongs to the current user
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    if (goal.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to check in to this goal',
      });
    }

    // 2. Create the check-in with pending status
    const checkIn = await CheckIn.create({
      goal: goalId,
      user: userId,
      note,
      stake,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Check-in submitted successfully, waiting for partner approval',
      data: checkIn,
    });
  } catch (error) {
    console.error('Error in submitCheckIn:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during check-in submission',
    });
  }
};

// @route   POST /api/checkins/approve/:id
// @desc    Verify and approve a partner's check-in
// @access  Private
const approveCheckIn = async (req, res) => {
  try {
    const checkInId = req.params.id;
    const partnerId = req.user._id;

    // 1. Find the check-in
    const checkIn = await CheckIn.findById(checkInId);
    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found',
      });
    }

    // 2. Check if already approved
    if (checkIn.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Check-in has already been approved',
      });
    }

    // 3. Verify partnership exists and is active between check-in owner and current user (partner)
    const partnership = await Partnership.findOne({
      $or: [
        { user1: checkIn.user, user2: partnerId },
        { user2: checkIn.user, user1: partnerId },
      ],
      status: 'active',
    });

    if (!partnership) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this check-in. Active partnership required.',
      });
    }

    // 4. Update check-in status
    checkIn.status = 'approved';
    checkIn.verifiedBy = partnerId;
    checkIn.verifiedAt = new Date();
    await checkIn.save();

    // 5. Update goal's lastCheckinAt
    const goal = await Goal.findById(checkIn.goal);
    if (goal) {
      goal.lastCheckinAt = new Date();
      await goal.save();
    }

    res.status(200).json({
      success: true,
      message: 'Check-in approved successfully! Partner pulse updated.',
      data: checkIn,
    });
  } catch (error) {
    console.error('Error in approveCheckIn:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during check-in approval',
    });
  }
};

module.exports = {
  submitCheckIn,
  approveCheckIn,
};
