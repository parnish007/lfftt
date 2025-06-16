const express = require('express');
const router = express.Router();

const {
  createMessage,
  getAllMessages,
  deleteMessage
} = require('../controllers/contactController');

// POST /api/contact → submit contact message (public)
router.post('/', createMessage);

// GET /api/contact → get all messages (admin view)
router.get('/', getAllMessages);

// DELETE /api/contact/:id → delete a message (admin)
router.delete('/:id', deleteMessage);

module.exports = router;
