const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  packageType: {
    type: String,
    enum: ['Tour', 'Vehicle', 'Custom'],
    required: true
  },
  packageName: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    type: String,
    default: '',
    trim: true
  },
  destination: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['NPR', 'INR', 'USD', 'EUR', 'DKK'],
      default: 'NPR'
    }
  },
  notes: {
    type: String,
    default: '',
    trim: true
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
    default: '',
    trim: true
  }
}, { timestamps: true }); // ✅ adds createdAt & updatedAt fields for auditing

module.exports = mongoose.model('Bill', billSchema);
