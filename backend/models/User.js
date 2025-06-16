// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
    minlength: 4
  },
  avatar: {
    type: String,
    default: '/public/images/users/default-user.png'
  },
  savedTours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  }],
  languagePreference: {
    type: String,
    enum: ['English', 'Nepali', 'Hindi'],
    default: 'English'
  }
}, { timestamps: true });

// ✅ Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Password validation
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

