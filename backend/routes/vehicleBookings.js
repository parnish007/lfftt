const express = require('express');
const router = express.Router();
const {
  createVehicleBooking,
  getVehicleBookings,
  getAcceptedVehicleBookings,
  deleteVehicleBooking,
  getNewVehicleBookingCount,
  updateVehicleBookingStatus
} = require('../controllers/vehicleBookingController');

// Create a new vehicle booking
router.post('/', createVehicleBooking);

// Admin: Get all vehicle bookings
router.get('/', getVehicleBookings);

// Admin: Get accepted (unbilled) vehicle bookings — for billing
router.get('/accepted', getAcceptedVehicleBookings);

// Admin: Get count of new vehicle bookings (for badge)
router.get('/new-count', getNewVehicleBookingCount);

// ✅ FIXED: Use PATCH to match frontend request
router.patch('/:id', updateVehicleBookingStatus);

// Admin: Delete a specific booking
router.delete('/:id', deleteVehicleBooking);

module.exports = router;
