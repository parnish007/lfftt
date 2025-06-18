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
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  origin: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  destination: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
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
    trim: true,
    maxlength: 2000,
    default: ''
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
