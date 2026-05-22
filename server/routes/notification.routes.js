const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/checkAuth');
const Notification = require('../models/Notification');

// @desc    Send a Fire Nudge to a partner
// @route   POST /api/notifications/nudge
// @access  Private
router.post('/nudge', checkAuth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'recipientId is required' });
    }

    const message = `${req.user.name} sent you a Fire Nudge! ⚡ Keep up the consistency!`;

    const notification = await Notification.create({
      user: recipientId,
      type: 'reminder',
      message,
      data: { senderId: req.user._id, senderName: req.user.name }
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error sending nudge:', error);
    res.status(500).json({ success: false, message: 'Server Error: Could not send nudge' });
  }
});

// @desc    Get all notifications for the logged in user
// @route   GET /api/notifications
// @access  Private
router.get('/', checkAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notifications' });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', checkAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, message: 'Server error updating notification' });
  }
});

module.exports = router;
