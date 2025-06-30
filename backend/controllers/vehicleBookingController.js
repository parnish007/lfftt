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

    if (!name || !phone || !email || !vehicle || !origin || !tripType || !travelDate) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    if (tripType === 'Rental' && (!days || days <= 0)) {
      return res.status(400).json({ error: "Please enter valid number of days for Rental." });
    }

    const booking = new VehicleBooking({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      vehicle: vehicle.trim(),
      origin: origin.trim(),
      tripType: tripType.trim(),
      travelDate: travelDate.trim(),
      days: tripType === 'Rental' ? Number(days) : undefined,
      message: message ? message.trim() : '',
      status: 'Pending'
    });

    await booking.save();
    res.status(201).json({ message: '✅ Vehicle booking created successfully.', booking });
  } catch (err) {
    console.error("❌ Error creating vehicle booking:", err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
};

// ✅ Get all vehicle bookings (Admin side) + mark as seen
exports.getVehicleBookings = async (req, res) => {
  try {
    const bookings = await VehicleBooking.find().sort({ createdAt: -1 });

    // 👉 Mark new bookings as seen
    await VehicleBooking.updateMany({ newBooking: true }, { newBooking: false });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching vehicle bookings:", err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};

// ✅ Get accepted bookings
exports.getAcceptedVehicleBookings = async (req, res) => {
  try {
    const acceptedBookings = await VehicleBooking.find({
      status: 'Confirmed'
    }).sort({ createdAt: -1 });
    res.json(acceptedBookings);
  } catch (err) {
    console.error("❌ Error fetching accepted bookings:", err);
    res.status(500).json({ error: 'Failed to fetch accepted bookings.' });
  }
};

// ✅ Delete a vehicle booking
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

// ✅ New: Get count of new vehicle bookings (for badge)
exports.getNewVehicleBookingCount = async (req, res) => {
  try {
    const count = await VehicleBooking.countDocuments({ newBooking: true });
    res.json({ count });
  } catch (err) {
    console.error("❌ Error fetching new vehicle booking count:", err);
    res.status(500).json({ error: 'Failed to fetch new vehicle booking count.' });
  }
};

// ✅ ✅ ✅ Add this to fix PUT update status error
exports.updateVehicleBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await VehicleBooking.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Vehicle booking not found.' });
    }

    res.json({ message: '✅ Vehicle booking status updated.', booking: updated });
  } catch (err) {
    console.error("❌ Error updating vehicle booking status:", err);
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
};
