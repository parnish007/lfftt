// backend/models/Admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  avatar: {
    type: String, // Path to profile image (e.g. /public/images/users/admin1.jpg)
    default: '/public/images/users/default-admin.png'
  }
}, { timestamps: true });

// ✅ Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Method to compare password
adminSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

