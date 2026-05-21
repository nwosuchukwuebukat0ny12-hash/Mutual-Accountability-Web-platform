require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');
const Partnership = require('./models/Partnership');
const CheckIn = require('./models/Checkin');

const runTest = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB!');

    // 1. Create Mock Users
    console.log('\n👤 Creating mock users...');
    const user1 = await User.create({
      name: 'Test User One',
      username: `testuser1_${Date.now()}`,
      email: `user1_${Date.now()}@test.com`,
      passwordHash: 'passwordhash123',
    });
    const user2 = await User.create({
      name: 'Test User Two',
      username: `testuser2_${Date.now()}`,
      email: `user2_${Date.now()}@test.com`,
      passwordHash: 'passwordhash123',
    });
    console.log(`✅ Created User 1: ${user1.name} (${user1._id})`);
    console.log(`✅ Created User 2: ${user2.name} (${user2._id})`);

    // 2. Create a Mock Goal
    console.log('\n🎯 Creating a mock goal...');
    const goal = await Goal.create({
      owner: user1._id,
      title: 'Workout every day',
      category: 'fitness',
      frequency: 'daily',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    console.log(`✅ Created Goal: "${goal.title}" (${goal._id})`);

    // 3. Create a Partnership
    console.log('\n🤝 Creating a partnership...');
    const partnership = await Partnership.create({
      user1: user1._id,
      user2: user2._id,
      status: 'pending',
      goal: goal._id,
    });
    console.log(`✅ Created Partnership with status: ${partnership.status} (${partnership._id})`);

    // Update status to active
    partnership.status = 'active';
    await partnership.save();
    console.log(`✅ Updated Partnership status to: ${partnership.status}`);

    // 4. Create a Check-in
    console.log('\n📝 Creating a check-in...');
    const checkin = await CheckIn.create({
      goal: goal._id,
      user: user1._id,
      note: 'Did 50 pushups and ran 2 miles!',
      stake: '$10 coffee',
      status: 'pending',
    });
    console.log(`✅ Created Check-in with status: ${checkin.status} (${checkin._id})`);

    // 5. Approve the Check-in
    console.log('\n👍 Approving the check-in...');
    checkin.status = 'approved';
    checkin.verifiedBy = user2._id;
    checkin.verifiedAt = new Date();
    await checkin.save();
    console.log(`✅ Approved Check-in! Status: ${checkin.status}, VerifiedBy: ${checkin.verifiedBy}`);

    // 6. Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await User.findByIdAndDelete(user1._id);
    await User.findByIdAndDelete(user2._id);
    await Goal.findByIdAndDelete(goal._id);
    await Partnership.findByIdAndDelete(partnership._id);
    await CheckIn.findByIdAndDelete(checkin._id);
    console.log('✅ Cleanup complete!');

    console.log('\n🎉 ALL SCHEMA TESTS PASSED SUCCESSFULLY! Task 1 database schemas are robust.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ SCHEMA TEST FAILED:', error);
    process.exit(1);
  }
};

runTest();
