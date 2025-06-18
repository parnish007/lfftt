const mongoose = require('mongoose');

const imageSettingSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    unique: true, // One setting per section (e.g., hero, tour, vehicle)
    trim: true,
    maxlength: 50
  },
  imagePath: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  useDefault: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt + updatedAt
});

module.exports = mongoose.model('ImageSetting', imageSettingSchema);
