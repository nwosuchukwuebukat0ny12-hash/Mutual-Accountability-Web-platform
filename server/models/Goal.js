const mongoose = require('mongoose');
const { Schema } = mongoose;

const GoalSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['fitness', 'study', 'career', 'habit', 'other'], required: true },
  deadline: { type: Date, required: true },
  frequency: { type: String, enum: ['daily', 'every2days', 'weekly'], required: true },
  milestones: [{
    title: String,
    targetDate: Date,
    completed: { type: Boolean, default: false }
  }],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  isPublic: { type: Boolean, default: false },
  lastCheckinAt: { type: Date },
  nextCheckinDue: { type: Date },
}, { timestamps: true });

GoalSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Goal', GoalSchema);
