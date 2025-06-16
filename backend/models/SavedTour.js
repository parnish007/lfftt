// backend/models/SavedTour.js

const mongoose = require('mongoose');

const savedTourSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Optional: Prevent duplicates
savedTourSchema.index({ user: 1, tour: 1 }, { unique: true });

module.exports = mongoose.model('SavedTour', savedTourSchema);

