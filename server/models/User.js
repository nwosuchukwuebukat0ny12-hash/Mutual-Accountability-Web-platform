const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  timezone: { type: String, required: true, default: 'UTC' },
  bio: { type: String, maxLength: 200 },
  avatar: { type: String, default: '' },
  categories: [{ type: String, enum: ['fitness', 'study', 'career', 'habit', 'other'] }],

  // Stats
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalGoals: { type: Number, default: 0 },
  completedGoals: { type: Number, default: 0 },
  badges: [{ type: String }],

  lastActiveAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },

  // Settings
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    reminderTime: { type: String, default: '09:00' }
  }
}, { timestamps: true });

// Text search index
UserSchema.index({ username: 'text', name: 'text' });
UserSchema.index({ currentStreak: -1 });

module.exports = mongoose.model('User', UserSchema);
