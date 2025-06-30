const express = require('express');
const router = express.Router();
const {
  createVehicleBooking,
  getVehicleBookings,
  getAcceptedVehicleBookings,
  deleteVehicleBooking,
  getNewVehicleBookingCount,
  updateVehicleBookingStatus // ✅ NEW: add this import
} = require('../controllers/vehicleBookingController');

// ✅ Create a new vehicle booking
router.post('/', createVehicleBooking);

// ✅ Admin: Get all vehicle bookings
router.get('/', getVehicleBookings);

// ✅ Admin: Get accepted (unbilled) vehicle bookings — for billing
router.get('/accepted', getAcceptedVehicleBookings);

// ✅ Admin: Get count of new vehicle bookings (for badge)
router.get('/new-count', getNewVehicleBookingCount);

// ✅ Admin: Update booking status (Approve/Reject)
router.put('/:id', updateVehicleBookingStatus); // ✅ NEW route

// ✅ Admin: Delete a specific booking
router.delete('/:id', deleteVehicleBooking);

module.exports = router;
