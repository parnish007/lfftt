const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  seatingCapacity: {
    type: Number,
    required: true
  },

  // ✅ Added currency field
  currency: {
    type: String,
    enum: ['NPR', 'INR', 'USD', 'EUR', 'DKK'],
    default: 'NPR'
  },

  pricePerDay: {
    type: Number,
    required: true
  },
  images: [
    {
      type: String // relative image filenames, e.g., 171xxx-vehicle.png
    }
  ],
  videos: [
    {
      type: String // relative video filenames, e.g., 171xxx-video.mp4
    }
  ],
  available: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  origin: {
    type: String
  },
  destination: {
    type: String
  },
  availableDates: [
    {
      type: Date
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
