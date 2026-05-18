const mongoose = require('mongoose');
const { Schema } = mongoose;

const CheckinSchema = new Schema({
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true, maxLength: 500 }, // Primary proof
  stake: { type: String }, // Custom note/stake for this check-in
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Partner who verifies
  verifiedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('CheckIn', CheckinSchema);
