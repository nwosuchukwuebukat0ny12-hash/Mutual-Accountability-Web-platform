const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 160 },
    categories: [{ type: String, enum: ['study', 'fitness', 'career', 'health', 'creative', 'other'] }],

    // Stats
    totalGoals: { type: Number, default: 0 },
    completedGoals: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    badges: [{ type: String }], // '7-day-streak', '14-day-streak', etc.

    lastActiveAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },

    // Settings
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        reminderTime: { type: String, default: '09:00' }
    }
}, { timestamps: true });

// Text search index
userSchema.index({ username: 'text', name: 'text' });

module.exports = mongoose.model('User', userSchema);