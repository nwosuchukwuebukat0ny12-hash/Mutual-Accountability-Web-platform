const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['streak_reset', 'reminder', 'info'], default: 'info' },
  message: { type: String, required: true },
  data: { type: Object },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
