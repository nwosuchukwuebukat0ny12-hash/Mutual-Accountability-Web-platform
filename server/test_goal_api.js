require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { createGoal } = require('./controllers/goalController');

// Mock Request and Response
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  timezone: 'America/New_York', // Test with a specific timezone
};

const mockReq = {
  user: mockUser,
  body: {
    title: 'Test Goal - Drink Water',
    category: 'habit',
    frequency: 'daily',
    deadline: '2026-12-31',
    description: 'Testing the timezone logic',
  },
};

const mockRes = {
  status: function (code) {
    this.statusCode = code;
    return this;
  },
  json: function (data) {
    console.log('--- TEST RESULT ---');
    console.log('Status Code:', this.statusCode || 200);
    console.log('Response Body:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Verification Successful!');
      console.log('Goal created with nextCheckinDue:', data.data.nextCheckinDue);
      console.log('User Timezone was:', mockUser.timezone);
    } else {
      console.log('\n❌ Verification Failed!');
    }
    process.exit(0);
  },
};

// Run the test
const runTest = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected! Running createGoal test...');

    // We don't actually need to save the user to the DB for this mock test
    // but the controller expects req.user._id
    
    await createGoal(mockReq, mockRes);

  } catch (error) {
    console.error('Test Script Error:', error);
    process.exit(1);
  }
};

runTest();
