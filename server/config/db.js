const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error and exit the process — a failed DB connection is unrecoverable on startup.
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
