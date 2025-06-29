const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  vehicleType: {
    type: String,
    required: true,
    trim: true
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  currency: {
    type: String,
    enum: ['NPR', 'INR', 'USD', 'EUR', 'DKK'],
    default: 'NPR'
  },
  pricePerDay: {
    type: String,
    required: true,
    min: 0
  },
  images: [
    {
      type: String,
      trim: true // Stored as /uploads/filename.jpg
    }
  ],
  videos: [
    {
      type: String,
      trim: true // Stored as /uploads/video.mp4
    }
  ],
  available: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: 3000,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  destination: {
    type: String,
    trim: true
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

// Ensure slashes in image paths are forward slashes when returned
vehicleSchema.methods.toCleanObject = function() {
  const obj = this.toObject();
  obj.images = obj.images?.map(img => img.replace(/\\/g, '/')) || [];
  obj.videos = obj.videos?.map(vid => vid.replace(/\\/g, '/')) || [];
  return obj;
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
