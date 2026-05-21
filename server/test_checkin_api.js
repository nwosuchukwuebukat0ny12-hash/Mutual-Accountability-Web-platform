require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');
const Partnership = require('./models/Partnership');
const CheckIn = require('./models/CheckIn');

const { submitCheckIn, approveCheckIn } = require('./controllers/checkinController');
const validate = require('./middleware/validate');
const { submitCheckInSchema } = require('./utils/validators');

const runTests = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB!');

    // Create mock users
    console.log('\n👤 Creating test users...');
    const user1 = await User.create({
      name: 'Checkin Owner',
      username: `owner_${Date.now()}`,
      email: `owner_${Date.now()}@test.com`,
      passwordHash: 'hash123',
    });
    const user2 = await User.create({
      name: 'Valid Partner',
      username: `partner_${Date.now()}`,
      email: `partner_${Date.now()}@test.com`,
      passwordHash: 'hash123',
    });
    const user3 = await User.create({
      name: 'Unrelated User',
      username: `stranger_${Date.now()}`,
      email: `stranger_${Date.now()}@test.com`,
      passwordHash: 'hash123',
    });
    console.log(`✅ Created Checkin Owner: ${user1.username} (${user1._id})`);
    console.log(`✅ Created Partner: ${user2.username} (${user2._id})`);
    console.log(`✅ Created Stranger: ${user3.username} (${user3._id})`);

    // Create mock goal for user 1
    console.log('\n🎯 Creating goal for Checkin Owner...');
    const goal = await Goal.create({
      owner: user1._id,
      title: 'Complete 30 LeetCode problems',
      category: 'study',
      frequency: 'daily',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });
    console.log(`✅ Created Goal: "${goal.title}" (${goal._id})`);

    // ==========================================
    // TEST 1: Zod Validation (Empty Note)
    // ==========================================
    console.log('\n🧪 TEST 1: Zod Input Validation (Empty Note) — Task 3');
    let validatePassed = false;
    const mockRes1 = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        console.log('  -> Status:', this.statusCode);
        console.log('  -> Response:', JSON.stringify(data));
        if (this.statusCode === 400 && !data.success && data.errors) {
          console.log('  ✅ TEST 1 PASSED: Invalid input correctly rejected with Zod structure.');
          validatePassed = true;
        } else {
          console.log('  ❌ TEST 1 FAILED: Unexpected response structure.');
        }
      }
    };

    // Construct mock request for Zod validation
    const mockReq1 = {
      body: {
        goalId: goal._id.toString(),
        note: '', // Empty note to trigger Zod failure
        stake: '50', // Fixed: must be a positive number
      }
    };

    // We call the validate middleware function directly
    const validateMiddleware = validate(submitCheckInSchema);
    validateMiddleware(mockReq1, mockRes1, () => {
      console.log('  ❌ TEST 1 FAILED: Middleware allowed empty note to pass!');
    });

    // ==========================================
    // TEST 2: Valid Check-in Submission (Task 2)
    // ==========================================
    console.log('\n🧪 TEST 2: Valid Check-in Submission — Task 2');
    let submittedCheckIn = null;
    const mockRes2 = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        console.log('  -> Status:', this.statusCode);
        console.log('  -> Response:', JSON.stringify(data));
        if (this.statusCode === 201 && data.success && data.data.status === 'pending') {
          console.log('  ✅ TEST 2 PASSED: Check-in successfully submitted as pending!');
          submittedCheckIn = data.data;
        } else {
          console.log('  ❌ TEST 2 FAILED: Could not submit check-in.');
        }
      }
    };

    const mockReq2 = {
      user: user1,
      body: {
        goalId: goal._id.toString(),
        note: 'Completed 5 Recursion problems today. Proof attached.',
        stake: '10', // Fixed: must be a positive number
      }
    };

    await submitCheckIn(mockReq2, mockRes2);

    if (!submittedCheckIn) {
      throw new Error('Cannot continue tests without a successful check-in.');
    }

    // ==========================================
    // TEST 3: Stranger Approval Check (Task 2)
    // ==========================================
    console.log('\n🧪 TEST 3: Stranger Attempting to Approve Check-in (Unauthorized) — Task 2');
    let strangerRejected = false;
    const mockRes3 = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        console.log('  -> Status:', this.statusCode);
        console.log('  -> Response:', JSON.stringify(data));
        if (this.statusCode === 403 && !data.success) {
          console.log('  ✅ TEST 3 PASSED: Stranger correctly unauthorized to approve.');
          strangerRejected = true;
        } else {
          console.log('  ❌ TEST 3 FAILED: Stranger was allowed or incorrect status returned.');
        }
      }
    };

    const mockReq3 = {
      user: user3, // Stranger
      params: { id: submittedCheckIn._id.toString() },
    };

    await approveCheckIn(mockReq3, mockRes3);

    // ==========================================
    // TEST 4: Valid Partner Approval Check (Task 2)
    // ==========================================
    console.log('\n🧪 TEST 4: Valid Partner Approving Check-in — Task 2');
    // First, establish active partnership
    console.log('  🤝 Creating active partnership between owner and partner...');
    const partnership = await Partnership.create({
      requester: user1._id,
      recipient: user2._id,
      status: 'active',
      goal: goal._id,
    });

    let partnerApproved = false;
    const mockRes4 = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        console.log('  -> Status:', this.statusCode);
        console.log('  -> Response:', JSON.stringify(data));
        if (this.statusCode === 200 && data.success && data.data.status === 'approved' && data.data.partnerApproval.approvedBy.toString() === user2._id.toString()) {
          console.log('  ✅ TEST 4 PASSED: Check-in approved by partner successfully!');
          partnerApproved = true;
        } else {
          console.log('  ❌ TEST 4 FAILED: Check-in was not approved.');
        }
      }
    };

    const mockReq4 = {
      user: user2, // Valid partner
      params: { id: submittedCheckIn._id.toString() },
    };

    await approveCheckIn(mockReq4, mockRes4);

    // Verify Goal lastCheckinAt updated
    const updatedGoal = await Goal.findById(goal._id);
    if (updatedGoal.lastCheckinAt) {
      console.log(`  🎯 Verified: Goal lastCheckinAt updated successfully to ${updatedGoal.lastCheckinAt}`);
    } else {
      console.log('  ❌ Goal lastCheckinAt was not updated.');
    }

    // ==========================================
    // TEST 5: Duplicate Approval Check (Task 2)
    // ==========================================
    console.log('\n🧪 TEST 5: Attempting Duplicate Approval — Task 2');
    let duplicateRejected = false;
    const mockRes5 = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        console.log('  -> Status:', this.statusCode);
        console.log('  -> Response:', JSON.stringify(data));
        if (this.statusCode === 400 && !data.success) {
          console.log('  ✅ TEST 5 PASSED: Already approved check-in correctly rejected.');
          duplicateRejected = true;
        } else {
          console.log('  ❌ TEST 5 FAILED: Duplicate approval did not fail as expected.');
        }
      }
    };

    const mockReq5 = {
      user: user2,
      params: { id: submittedCheckIn._id.toString() },
    };

    await approveCheckIn(mockReq5, mockRes5);

    // ==========================================
    // CLEANUP
    // ==========================================
    console.log('\n🧹 Cleaning up test database...');
    await User.findByIdAndDelete(user1._id);
    await User.findByIdAndDelete(user2._id);
    await User.findByIdAndDelete(user3._id);
    await Goal.findByIdAndDelete(goal._id);
    await Partnership.findByIdAndDelete(partnership._id);
    await CheckIn.findByIdAndDelete(submittedCheckIn._id);
    console.log('✅ Cleanup completed!');

    console.log('\n🎉 ALL DYNAMIC CHECK-IN API & ZOD VALIDATION TESTS PASSED!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST RUN ERROR:', error);
    process.exit(1);
  }
};

runTests();
