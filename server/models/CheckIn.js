const mongoose = require('mongoose');
const { Schema } = mongoose;

const CheckinSchema = new Schema({
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true, maxLength: 500 }, // Primary proof
  stake: { type: String }, // Custom stake/bet for this check-in
  progress: { type: Number, min: 0, max: 100 }, // Progress % at time of check-in
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Backward compat alias for partnerApproval.approvedBy
  verifiedAt: { type: Date },
  partnerApproval: {
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  streakAtTime: { type: Number }, // Streak count at time of check-in
}, { timestamps: true });

module.exports = mongoose.model('CheckIn', CheckinSchema);
