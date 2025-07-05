const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// ✅ POST /api/auth/login
router.post('/login', loginUser);

// 🔒 You can enable registration later if needed
// const { registerUser } = require('../controllers/authController');
// router.post('/register', registerUser);

module.exports = router;
