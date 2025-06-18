const ImageSetting = require('../models/ImageSetting');
const path = require('path');

// ✅ Upload or update image OR toggle between default/uploaded
exports.updateImageSetting = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const useDefault = req.body.useDefault === 'true';

    let update = {};

    if (useDefault) {
      update = {
        useDefault: true,
        imagePath: getDefaultPathFor(sectionId)
      };
    }

    if (req.file) {
      update = {
        useDefault: false,
        imagePath: `/uploads/${req.file.filename}`
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
    trek: '/public/images/backgrounds/trek.png',
    flight: '/public/images/backgrounds/flight.png'
  };

  return defaultPaths[sectionId] || '/public/images/backgrounds/default.jpg';
}
