const express = require('express');
const router = express.Router();

const {
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest
} = require('../controllers/customizeController');

// ✅ POST: Create a new customization request (user-facing form)
router.post('/', createRequest);

// ✅ GET: Fetch all requests (for admin panel)
router.get('/', getRequests);

// ✅ PATCH: Update request status (Approved / Rejected / Pending)
router.patch('/:id/status', updateRequestStatus);

// ✅ DELETE: Remove a request (admin use only)
router.delete('/:id', deleteRequest);

module.exports = router;
