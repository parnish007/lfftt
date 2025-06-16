const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // allow guest bookings
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Tour', 'Vehicle', 'Trekking', 'Flight'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    default: 'Car'
  },
  people: {
    type: Number,
    default: 1,
    min: 1
  },
  hotel: {
    type: String,
    enum: ['Standard Hotel', 'Deluxe Hotel', 'Resort'],
    default: 'Standard Hotel'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  payment: {
    type: String,
    enum: ['On Confirmation', 'Online', 'Cash', 'eSewa', 'Khalti', 'BANKING APP', 'Card'],
    default: 'On Confirmation'
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
