const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartnershipSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'active'], default: 'pending' },
  goal: { type: Schema.Types.ObjectId, ref: 'Goal' },
}, { timestamps: true });

module.exports = mongoose.model('Partnership', PartnershipSchema);
