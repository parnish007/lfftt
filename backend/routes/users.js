// backend/routes/users.js

const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

// GET /api/users/:id
router.get('/:id', getUserProfile);

// PUT /api/users/:id
router.put('/:id', updateUserProfile);

// GET /api/users (admin)
router.get('/', getAllUsers);

// DELETE /api/users/:id (admin)
router.delete('/:id', deleteUser);

module.exports = router;

