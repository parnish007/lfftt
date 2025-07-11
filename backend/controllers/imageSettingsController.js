const ImageSetting = require('../models/ImageSetting');
const path = require('path');

// ✅ Upload or update image OR toggle between default/uploaded
exports.updateImageSetting = async (req, res) => {
  try {
    const { sectionId } = req.params;

    let update = {};

    // ✅ Handle mode: 'default' sent by frontend
    if (req.body.mode === 'default') {
      update = {
        useDefault: true,
        imagePath: getDefaultPathFor(sectionId)
      };
    }

    // ✅ Handle uploaded file (Cloudinary path)
    if (req.file && req.file.path) {
      update = {
        useDefault: false,
        imagePath: req.file.path // ✅ Cloudinary URL
      };
    }

    if (!Object.keys(update).length) {
      return res.status(400).json({ error: "No update provided." });
    }

    const updated = await ImageSetting.findOneAndUpdate(
      { sectionId },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: '✅ Image setting updated.', setting: updated });
  } catch (err) {
    console.error("❌ Error updating image setting:", err);
    res.status(500).json({ error: "Failed to update image setting." });
  }
};

// ✅ Get all image settings
exports.getAllImageSettings = async (req, res) => {
  try {
    const settings = await ImageSetting.find({});
    res.json(settings);
  } catch (err) {
    console.error("❌ Error fetching image settings:", err);
    res.status(500).json({ error: "Failed to fetch image settings." });
  }
};

// ✅ Return default path based on sectionId
function getDefaultPathFor(sectionId) {
  const defaultPaths = {
    hero: '/public/images/backgrounds/mountain.jpeg',
    tour: '/public/images/backgrounds/back.png',
    vehicle: '/public/images/backgrounds/vehicle.png',
    trekking: '/public/images/backgrounds/trek.png',
    flight: '/public/images/backgrounds/flight.png',
    logo: '/public/images/backgrounds/logo.jpeg'
  };

  return defaultPaths[sectionId] || '/public/images/backgrounds/default.jpg';
}
