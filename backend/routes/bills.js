const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// ✅ GET accepted bookings for billing (tour or vehicle)
router.get('/', billController.getBillableRequests);

// ✅ POST default bill (by booking ID)
router.post('/send/:id', billController.sendBillToUser);

// ✅ POST custom bill (manually entered by admin)
router.post('/', billController.sendCustomBill);

module.exports = router;
