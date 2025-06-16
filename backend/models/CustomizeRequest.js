// backend/models/CustomizeRequest.js

const mongoose = require('mongoose');

const customizeRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // For guest users
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  vehicle: {
    type: String,
    enum: ['Car', 'Scorpio', 'Bus', 'Van', 'Any'],
    default: 'Any'
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomizeRequest', customizeRequestSchema);
