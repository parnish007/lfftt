const mongoose = require('mongoose');

const imageSettingSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    unique: true // Ensure one setting per homepage section (e.g., hero, tour, vehicle)
  },
  imagePath: {
    type: String,
    required: true
  },
  useDefault: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ImageSetting', imageSettingSchema);
