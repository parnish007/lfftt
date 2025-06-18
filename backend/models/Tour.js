const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    enum: ['NPR', 'INR', 'USD', 'EUR', 'DKK'],
    default: 'NPR'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  activities: {
    type: [String],
    default: []
  },
  accommodation: {
    type: String,
    default: 'Standard Hotel'
  },
  meals: {
    type: String,
    default: 'Breakfast'
  },
  overview: {
    type: String,
    maxlength: 2000
  },
  images: [{
    type: String // uploads/filename.jpg (relative path)
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
