const mongoose = require('mongoose');

const vehicleBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },

  vehicle: { type: String, required: true }, // vehicle name/type from user input
  origin: { type: String, required: true },

  tripType: {
    type: String,
    enum: ['One Way', 'Round Trip', 'Rental'],
    required: true
  },

  travelDate: { type: String, required: true },

  days: { type: Number }, // optional: required only for 'Rental'

  message: { type: String },

  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('VehicleBooking', vehicleBookingSchema);
