const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  }
}, { timestamps: true }); // Automatically includes createdAt + updatedAt

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
