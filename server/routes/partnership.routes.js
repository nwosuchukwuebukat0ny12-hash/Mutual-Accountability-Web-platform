const express = require('express');
const router = express.Router();
const { invitePartner, getPendingInvites, respondToInvite } = require('../controllers/partnershipController');
const { protect } = require('../middleware/auth');

// @route   POST /api/partnerships/invite
// @desc    Send a partnership invitation
// @access  Private
router.post('/invite', protect, invitePartner);

// @route   GET /api/partnerships/pending
// @desc    Get pending received invitations
// @access  Private
router.get('/pending', protect, getPendingInvites);

// @route   POST /api/partnerships/respond
// @desc    Respond to a partnership invitation
// @access  Private
router.post('/respond', protect, respondToInvite);

module.exports = router;
