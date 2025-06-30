const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// ✅ GET accepted bookings for billing (tour or vehicle)
router.get('/', billController.getBillableRequests);

// ✅ POST default bill (by booking ID)
router.post('/send/:id', billController.sendBillToUser);

// ✅ POST custom bill (manually entered by admin)
router.post('/', billController.sendCustomBill);

// ✅ NEW: Get confirmed bookings with no bill yet
router.get('/unbilled', billController.getUnbilledConfirmedBookings);

router.get('/history', async (req, res) => {
  try {
    const bills = await require('../models/Bill').find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    console.error("❌ Error loading billed history:", err);
    res.status(500).json({ error: "Failed to fetch bill history" });
  }
});


module.exports = router;
