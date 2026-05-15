const mongoose = require('mongoose');
const { Schema } = mongoose;

const CheckInSchema = new Schema({
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['done', 'missed', 'partial'], required: true },
  progress: { type: Number, min: 0, max: 100 },
  note: { type: String, maxLength: 500 }, // Primary proof for V1
  partnerApproval: {
    approved: { type: Boolean, default: false },
    approvedAt: Date,
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, maxLength: 300 },
    createdAt: { type: Date, default: Date.now }
  }],
  streakAtTime: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('CheckIn', CheckInSchema);
