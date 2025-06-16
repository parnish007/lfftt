const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  updateImageSetting,
  getAllImageSettings
} = require('../controllers/imageSettingsController');

// ✅ Upload or update image or mode (default/custom)
router.post('/:sectionId', upload.single('image'), updateImageSetting);

// ✅ Get all homepage image settings (for admin view)
router.get('/', getAllImageSettings);

module.exports = router;
