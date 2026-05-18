const express = require('express');
const router = express.Router();
const { searchPartner, invitePartner, getPendingInvites, respondToInvite, getActivePartnership } = require('../controllers/partnershipController');
const { protect } = require('../middleware/auth');

// @route   GET /api/partnerships/search
// @desc    Search for an accountability partner by username
// @access  Private
router.get('/search', protect, searchPartner);

// @route   POST /api/partnerships/invite
// @desc    Send a partnership invitation
// @access  Private
router.post('/invite', protect, invitePartner);

// @route   GET /api/partnerships/pending
// @desc    Get pending received invitations
// @access  Private
router.get('/pending', protect, getPendingInvites);

// @route   GET /api/partnerships/active
// @desc    Get current active partnership
// @access  Private
router.get('/active', protect, getActivePartnership);

// @route   POST /api/partnerships/respond
// @desc    Respond to a partnership invitation
// @access  Private
router.post('/respond', protect, respondToInvite);

module.exports = router;
