const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: [true, 'Headline is required'],
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 500
  },
  image: {
    type: String, // relative or public path like /uploads/banner123.jpg
    trim: true,
    default: '' // ✅ ensures consistency in case no image is uploaded
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // ✅ include timestamps for better record tracking

module.exports = mongoose.model('Banner', bannerSchema);
