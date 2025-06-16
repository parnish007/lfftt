// backend/routes/bookings.js

const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getAcceptedBookingsForBilling // ✅ NEW: For billing only
} = require('../controllers/bookingController');

// ✅ Admin: Get all bookings
router.get('/', getAllBookings);

// ✅ Admin: Get accepted (unbilled) bookings - used in billing
router.get('/accepted', getAcceptedBookingsForBilling); // ✅ NEW endpoint

// ✅ Public: Create a new booking
router.post('/', createBooking);

// ✅ User: Get bookings by user ID
router.get('/:userId', getUserBookings);

// ✅ Admin/User: Delete a booking
router.delete('/:bookingId', cancelBooking);

// ✅ Admin: Update booking status (Confirm/Cancel)
router.patch('/:bookingId', updateBookingStatus);

module.exports = router;
