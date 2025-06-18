const express = require('express');
const router = express.Router();
const { getBanners, addBanner, deleteBanner } = require('../controllers/bannerController');
const upload = require('../middleware/uploadMiddleware');

// ✅ GET all banners
router.get('/', getBanners);

// ✅ POST add new banner (single image upload)
router.post('/', upload.single('image'), addBanner);

// ✅ DELETE a banner by ID
router.delete('/:id', deleteBanner);

module.exports = router;
