const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  currency: {
    type: String,
    enum: ['NPR', 'INR', 'USD', 'EUR', 'DKK'],
    default: 'NPR'
  },
  price: {
    type: String, // ✅ NOW STRING: allows "Negotiable" or "5000"
    required: true
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
    default: 'Standard Hotel',
    trim: true
  },
  meals: {
    type: String,
    default: 'Breakfast',
    trim: true
  },
  overview: {
    type: String,
    maxlength: 20000,
    trim: true
  },
  overviewHTML: {
    type: String,
    trim: true
  },
  itineraryDays: {
    type: [String],
    default: []
  },
  images: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

// ✅ Clean paths before sending
tourSchema.methods.toCleanObject = function () {
  const obj = this.toObject();
  obj.images = obj.images?.map(img => img.replace(/\\/g, '/')) || [];
  return obj;
};

module.exports = mongoose.model('Tour', tourSchema);
