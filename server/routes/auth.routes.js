const express = require('express');
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { checkAuth } = require('../middleware/checkAuth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', checkAuth, getMe);
router.patch('/profile', checkAuth, updateProfile);

module.exports = router;
