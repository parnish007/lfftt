// backend/routes/chat.js

const express = require('express');
const router = express.Router();
const { getUserMessages, getAdminMessages } = require('../controllers/chatController');

// GET /api/chat/user/:userId
router.get('/user/:userId', getUserMessages);

// GET /api/chat/admin
router.get('/admin', getAdminMessages);

module.exports = router;

