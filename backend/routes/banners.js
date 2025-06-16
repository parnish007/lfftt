const express = require('express');
const router = express.Router();
const { getBanners, addBanner, deleteBanner } = require('../controllers/bannerController');
const upload = require('../middleware/uploadMiddleware');

// ✅ GET all banners
router.get('/', async (req, res) => {
  console.log("🔍 [GET] Fetching all banners...");
  await getBanners(req, res);
});

// ✅ POST add new banner (single image upload)
router.post('/', upload.single('image'), async (req, res) => {
  console.log("📥 [POST] Adding new banner...");
  await addBanner(req, res);
});

// ✅ DELETE a banner by ID
router.delete('/:id', async (req, res) => {
  console.log(`🗑 [DELETE] Removing banner ID: ${req.params.id}`);
  await deleteBanner(req, res);
});

module.exports = router;
