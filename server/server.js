require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  // Required for the browser to send HttpOnly cookies cross-origin
  credentials: true,
}));

// Health check route — useful for Render/Railway deployment health pings
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Mutual API is running' });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/goals', require('./routes/goal.routes'));
app.use('/api/checkins', require('./routes/checkin.routes'));
app.use('/api/partnerships', require('./routes/partnership.routes'));
// app.use('/api/notifications', require('./routes/notification.routes'));

// Periodic background task: check for missed check-ins and reset streaks
try {
  const { runCheckStreaks } = require('./tasks/checkStreaks');

  // Run once on startup
  runCheckStreaks().catch(err => console.error('Error running initial checkStreaks:', err));

  // Then run every 15 minutes
  setInterval(() => {
    runCheckStreaks().catch(err => console.error('Error running checkStreaks:', err));
  }, 1000 * 60 * 15);
} catch (err) {
  console.warn('checkStreaks task could not be loaded:', err.message);
}

// Streak auditor cron job (requires node-cron)
try {
  const { initStreakAuditor } = require('./jobs/streakAuditor');
  // Use env SERVER_TIMEZONE or default to UTC. Cron library understands IANA timezones.
  initStreakAuditor(process.env.SERVER_TIMEZONE || 'UTC');
} catch (err) {
  console.warn('streakAuditor job could not be loaded (node-cron may be missing):', err.message);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
