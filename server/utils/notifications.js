const Notification = require('../models/Notification');

/**
 * Creates a notification in the database and emits it via Socket.io if available.
 * @param {object} app - The Express app instance (to retrieve 'io')
 * @param {object} params - Notification parameters
 * @param {string} params.userId - Recipient user ID
 * @param {string} params.type - Notification type ('streak_reset', 'reminder', 'info', etc.)
 * @param {string} params.message - Human readable text
 * @param {object} [params.data] - Additional metadata payload
 */
const createNotification = async (app, { userId, type, message, data }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      data
    });

    const io = app.get('io');
    if (io) {
      io.to(`user_${userId}`).emit('notification_received', notification);
    }
    return notification;
  } catch (error) {
    console.error('Error creating notification utility:', error);
  }
};

module.exports = { createNotification };
