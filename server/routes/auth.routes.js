const express = require('express');
const { register, login, logout, getMe, updateProfile, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { auditUserStreak } = require('../middleware/streakAuditor');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, auditUserStreak, getMe);
router.patch('/profile', protect, updateProfile);
router.delete('/me', protect, deleteAccount);

module.exports = router;
