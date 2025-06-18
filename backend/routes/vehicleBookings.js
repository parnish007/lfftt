const express = require('express');
const router = express.Router();
const {
  createVehicleBooking,
  getVehicleBookings,
  getAcceptedVehicleBookings, // ✅ NEW: only accepted & unbilled
  deleteVehicleBooking
} = require('../controllers/vehicleBookingController');

// ✅ Create a new vehicle booking
// POST /api/vehicle-bookings
router.post('/', createVehicleBooking);

// ✅ Admin: Get all vehicle bookings
// GET /api/vehicle-bookings
router.get('/', getVehicleBookings);

// ✅ Admin: Get accepted (unbilled) vehicle bookings — for billing
// GET /api/vehicle-bookings/accepted
router.get('/accepted', getAcceptedVehicleBookings);

// ✅ Admin: Delete a specific booking
// DELETE /api/vehicle-bookings/:id
router.delete('/:id', deleteVehicleBooking);

module.exports = router;
