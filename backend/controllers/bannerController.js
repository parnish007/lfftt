const Banner = require('../models/Banner');
const path = require('path');
const fs = require('fs');

// ✅ Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    console.error("❌ Error fetching banners:", err);
    res.status(500).json({ error: "Failed to fetch banners", details: err.message });
  }
};

// ✅ Add new banner
exports.addBanner = async (req, res) => {
  try {
    const { headline, description } = req.body;

    if (!headline || !description) {
      return res.status(400).json({ error: "Headline and description are required" });
    }

    const image = req.file ? `uploads/${req.file.filename}` : null;

    const newBanner = new Banner({
      headline: headline.trim(),
      description: description.trim(),
      image: image
    });

    await newBanner.save();

    console.log(`✅ Banner saved: ${newBanner.headline}`);
    res.status(201).json({ message: 'Banner added', banner: newBanner });
  } catch (err) {
    console.error("❌ Error adding banner:", err);
    res.status(500).json({ error: "Failed to add banner", details: err.message });
  }
};

// ✅ Delete banner (and remove image file if exists)
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Delete associated image file if exists
    if (banner.image) {
      const imagePath = path.join(__dirname, '../../public', banner.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.warn(`⚠ Failed to delete image file: ${imagePath}`, err.message);
        } else {
          console.log(`🗑 Deleted image file: ${imagePath}`);
        }
      });
    }

    await Banner.findByIdAndDelete(req.params.id);
    console.log(`✅ Banner deleted: ${banner.headline}`);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    console.error("❌ Error deleting banner:", err);
    res.status(500).json({ error: "Failed to delete banner", details: err.message });
  }
};
