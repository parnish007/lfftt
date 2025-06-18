\const mongoose = require('mongoose');

const vehicleBookingSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  vehicle: { 
    type: String, 
    required: true // Vehicle name/type as entered by user
  },
  origin: { 
    type: String, 
    required: true 
  },
  tripType: {
    type: String,
    enum: ['One Way', 'Round Trip', 'Rental'],
    required: true
  },
  travelDate: { 
    type: String, 
    required: true 
  },
  days: { 
    type: Number 
    // Required only if tripType is Rental (validated in controller)
  },
  message: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('VehicleBooking', vehicleBookingSchema);
