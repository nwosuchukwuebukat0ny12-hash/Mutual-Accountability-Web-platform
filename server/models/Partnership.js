const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartnershipSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  partnerGoal: { type: Schema.Types.ObjectId, ref: 'Goal' }, // Optional: recipient's linked goal
  status: { type: String, enum: ['pending', 'active', 'declined', 'ended'], default: 'pending' },
  startedAt: { type: Date },
}, { timestamps: true });

PartnershipSchema.index({ requester: 1, recipient: 1, status: 1 });

module.exports = mongoose.model('Partnership', PartnershipSchema);
