const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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

  // ✅ Currency field added
  currency: {
    type: String,
    enum: ['NPR', 'INR', 'USD', 'EUR', 'DKK'],
    default: 'NPR'
  },

  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
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
    type: String  // ✅ e.g., uploads/filename.jpg (relative path, no /public)
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
