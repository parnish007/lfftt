const mongoose = require('mongoose');

const customizeRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Guest users allowed
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
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
    trim: true,
    maxlength: 100
  },
  destination: {
    type: String,
    trim: true,
    maxlength: 100
  },
  budget: {
    type: String, // allows ranges, text, or numeric values
    trim: true,
    maxlength: 50
  },
  duration: {
    type: Number,
    min: 1
  },
  vehicle: {
    type: String,
    trim: true,
    maxlength: 50,
    default: 'Any'
  },
  message: {
    type: String,
    trim: true,
    maxlength: 2000
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
