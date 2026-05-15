const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartnershipSchema = new Schema({
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'active', 'declined', 'ended'], default: 'pending' },
  startedAt: { type: Date },
  endedAt: { type: Date },
  partnerGoal: { type: Schema.Types.ObjectId, ref: 'Goal' },
}, { timestamps: true });

module.exports = mongoose.model('Partnership', PartnershipSchema);
