require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

app.set('io', io);

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

const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);

// Health check route — useful for Render/Railway deployment health pings
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Mutual API is running' });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/goals', require('./routes/goal.routes'));
app.use('/api/checkins', require('./routes/checkin.routes'));
app.use('/api/partnerships', require('./routes/partnership.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Periodic background task: check for missed check-ins and reset streaks
// [Phase 5 Refactor: Disabled in favor of lazy evaluation]
/*
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
*/

// Streak auditor cron job (requires node-cron)
// [Phase 5 Refactor: Disabled in favor of lazy evaluation]
/*
try {
  const { initStreakAuditor } = require('./jobs/streakAuditor');
  // Use env SERVER_TIMEZONE or default to UTC. Cron library understands IANA timezones.
  initStreakAuditor(process.env.SERVER_TIMEZONE || 'UTC');
} catch (err) {
  console.warn('streakAuditor job could not be loaded (node-cron may be missing):', err.message);
}
*/

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
