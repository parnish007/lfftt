const Banner = require('../models/Banner');
const cloudinary = require('cloudinary').v2;

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

// ✅ Add new banner with Cloudinary image
exports.addBanner = async (req, res) => {
  try {
    const { headline, description } = req.body;

    if (!headline || !description) {
      return res.status(400).json({ error: "Headline and description are required" });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'lfftt/banners'
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const newBanner = new Banner({
      headline: headline.trim(),
      description: description.trim(),
      image: imageUrl,
      imagePublicId: imagePublicId
    });

    await newBanner.save();

    console.log(`✅ Banner saved: ${newBanner.headline}`);
    res.status(201).json({ message: 'Banner added', banner: newBanner });
  } catch (err) {
    console.error("❌ Error adding banner:", err);
    res.status(500).json({ error: "Failed to add banner", details: err.message });
  }
};

// ✅ Delete banner and remove from Cloudinary
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // ✅ Remove Cloudinary image if available
    if (banner.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(banner.imagePublicId);
        console.log(`🗑 Deleted Cloudinary image: ${banner.imagePublicId}`);
      } catch (cloudErr) {
        console.warn(`⚠ Failed to delete Cloudinary image: ${cloudErr.message}`);
      }
    }

    await Banner.findByIdAndDelete(req.params.id);
    console.log(`✅ Banner deleted: ${banner.headline}`);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    console.error("❌ Error deleting banner:", err);
    res.status(500).json({ error: "Failed to delete banner", details: err.message });
  }
};
