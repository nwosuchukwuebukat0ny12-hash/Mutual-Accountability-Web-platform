/**
 * Integration Tests for Security and Streak Engine
 * Run with: node test_streak_engine.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { runCheckStreaks } = require('./tasks/checkStreaks');
const User = require('./models/User');

const testStreakLogic = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for Streak Engine Testing');
    
    // Simulate user with checkin missed
    const testUser = new User({
      name: 'Test Streak',
      username: 'test_streak_' + Date.now(),
      email: 'test_streak_' + Date.now() + '@example.com',
      passwordHash: 'hashed',
      currentStreak: 5,
      longestStreak: 5,
      badges: ['pact_keeper']
    });
    await testUser.save();
    console.log('✅ Test user created with streak 5');

    // Run the streak engine (this usually looks for active goals with missed deadlines)
    // For a unit test, we'd mock the goals. Here we just ensure the task runs without error.
    await runCheckStreaks();
    console.log('✅ runCheckStreaks executed successfully');

    // Cleanup
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Test cleanup completed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testStreakLogic();
