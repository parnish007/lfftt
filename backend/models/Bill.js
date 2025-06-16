const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  packageType: {
    type: String,
    enum: ['Tour', 'Vehicle', 'Custom'],
    required: true
  },
  packageName: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    default: ''
  },
  destination: {
    type: String,
    default: ''
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['NPR', 'INR', 'USD', 'EUR', 'DKK'],
      default: 'NPR'
    }
  },
  notes: {
    type: String,
    default: ''
  },
  dateIssued: {
    type: Date,
    default: Date.now
  },
  adminEdited: {
    type: Boolean,
    default: false
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  filePath: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Bill', billSchema);
