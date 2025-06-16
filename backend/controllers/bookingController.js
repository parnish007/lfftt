const Booking = require('../models/Booking');

// ✅ Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const data = { ...req.body };

    // ✅ Basic sanitization and safety
    data.startDate = new Date(data.startDate);
    data.people = Math.max(1, parseInt(data.people) || 1);
    data.total = Math.max(0, parseFloat(data.total) || 0);
    data.status = 'pending'; // default status
    data.billed = false;     // not billed yet

    const booking = new Booking(data);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error('❌ Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// ✅ Get all bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// ✅ Get bookings by user ID
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId });
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
};

// ✅ Delete booking (Admin)
exports.cancelBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.bookingId);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: '🗑️ Booking deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

// ✅ Update booking status (Confirm / Cancel)
exports.updateBookingStatus = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating booking status:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// ✅ Get only accepted & unbilled bookings (for manage-bills)
exports.getAcceptedBookingsForBilling = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'accepted', billed: { $ne: true } }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching accepted bookings for billing:', err);
    res.status(500).json({ error: 'Failed to fetch billing-ready bookings' });
  }
};
