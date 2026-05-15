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

// API Routes (populated as each feature is built)
app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/goals', require('./routes/goal.routes'));
// app.use('/api/checkins', require('./routes/checkin.routes'));
// app.use('/api/partnerships', require('./routes/partnership.routes'));
// app.use('/api/notifications', require('./routes/notification.routes'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
