const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getAcceptedBookingsForBilling,
  getNewBookingCount // ✅ NEW: For badge
} = require('../controllers/bookingController');

// ✅ Admin: Get all bookings
router.get('/', getAllBookings);

// ✅ Admin: Get accepted (unbilled) bookings - used in billing
router.get('/accepted', getAcceptedBookingsForBilling);

// ✅ Admin: Get count of new bookings (for badge)
router.get('/new-count', getNewBookingCount); // ✅ NEW endpoint

// ✅ Public: Create a new booking
router.post('/', createBooking);

// ✅ User: Get bookings by user ID
router.get('/:userId', getUserBookings);

// ✅ Admin/User: Delete a booking
router.delete('/:bookingId', cancelBooking);

// ✅ Admin: Update booking status (Confirm/Cancel)
router.patch('/:bookingId', updateBookingStatus);

module.exports = router;
