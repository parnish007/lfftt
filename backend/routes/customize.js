const express = require('express');
const router = express.Router();

const {
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest
} = require('../controllers/customizeController');

// ✅ Create a new customization request (public)
router.post('/', createRequest);

// ✅ Get all customization requests (admin view)
router.get('/', getRequests);

// ✅ Update the status of a specific request (approve/reject)
router.patch('/:id/status', updateRequestStatus);

// ✅ Delete a request permanently (admin)
router.delete('/:id', deleteRequest);

module.exports = router;
