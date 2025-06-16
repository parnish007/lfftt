const VehicleBooking = require('../models/VehicleBooking');

// ✅ Create a new vehicle booking (User side)
exports.createVehicleBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      vehicle,
      origin,
      tripType,
      travelDate,
      days,
      message
    } = req.body;

    // 🔒 Validate required fields
    if (!name || !phone || !email || !vehicle || !origin || !tripType || !travelDate) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    // ⏳ If rental, 'days' must be provided and > 0
    if (tripType === 'Rental' && (!days || days <= 0)) {
      return res.status(400).json({ error: "Please enter valid number of days for Rental." });
    }

    const booking = new VehicleBooking({
      name,
      phone,
      email,
      vehicle,
      origin,
      tripType,
      travelDate,
      days: tripType === 'Rental' ? days : undefined, // Only store days for rental
      message,
      status: 'pending' // ✅ Default status
    });

    await booking.save();
    res.status(201).json({ message: '✅ Vehicle booking created successfully.' });
  } catch (err) {
    console.error("❌ Error creating booking:", err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
};

// ✅ Get all vehicle bookings (Admin side)
exports.getVehicleBookings = async (req, res) => {
  try {
    const bookings = await VehicleBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};

// ✅ Get accepted and unbilled bookings (for billing)
exports.getAcceptedVehicleBookings = async (req, res) => {
  try {
    const acceptedBookings = await VehicleBooking.find({ status: 'accepted', billed: { $ne: true } });
    res.json(acceptedBookings);
  } catch (err) {
    console.error("❌ Error fetching accepted bookings:", err);
    res.status(500).json({ error: 'Failed to fetch accepted bookings.' });
  }
};

// ✅ Optional: Delete a vehicle booking
exports.deleteVehicleBooking = async (req, res) => {
  try {
    const deleted = await VehicleBooking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.json({ message: '🗑️ Booking deleted successfully.' });
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
};
