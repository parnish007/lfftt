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
    type: String, // relative path like uploads/banner123.jpg
    required: false,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
