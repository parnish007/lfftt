const Tour = require('../models/Tour');
const slugify = require('slugify');

// ✅ Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(
      tours.map(t => ({
        ...t.toObject(),
        images: t.images?.map(img => img.replace(/\\/g, '/')) || []
      }))
    );
  } catch (err) {
    console.error("❌ Error fetching tours:", err);
    res.status(500).json({ error: 'Failed to fetch tours', details: err.message });
  }
};

// ✅ Get single tour by slug
exports.getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug });
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json({
      ...tour.toObject(),
      images: tour.images?.map(img => img.replace(/\\/g, '/')) || []
    });
  } catch (err) {
    console.error("❌ Error fetching tour by slug:", err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// ✅ Create a new tour
exports.createTour = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map(file => file.relativePath || `/uploads/${file.filename}`)
      : [];

    let activities = [];
    if (req.body.activities) {
      if (Array.isArray(req.body.activities)) {
        activities = req.body.activities;
      } else {
        try {
          activities = JSON.parse(req.body.activities);
        } catch {
          activities = req.body.activities.split(',').map(a => a.trim()).filter(Boolean);
        }
      }
    }

    const itineraryDays = req.body["itineraryDays[]"]
      ? Array.isArray(req.body["itineraryDays[]"])
        ? req.body["itineraryDays[]"]
        : [req.body["itineraryDays[]"]]
      : [];

    const newTour = new Tour({
      name: req.body.name.trim(),
      slug: slugify(req.body.name, { lower: true, strict: true }),
      description: req.body.description,
      currency: req.body.currency || 'NPR',
      price: req.body.price,
      duration: Number(req.body.duration),
      activities,
      accommodation: req.body.accommodation,
      meals: req.body.meals,
      overview: req.body.overview,
      overviewHTML: req.body.overviewHTML || "",
      itineraryDays,
      images
    });

    await newTour.save();
    console.log(`✅ New tour saved: ${newTour.name}`);
    res.status(201).json({
      ...newTour.toObject(),
      images: newTour.images?.map(img => img.replace(/\\/g, '/')) || []
    });
  } catch (err) {
    console.error("❌ Error creating tour:", err);
    res.status(400).json({ error: 'Failed to create tour', details: err.message });
  }
};

// ✅ Update tour by slug
exports.updateTour = async (req, res) => {
  try {
    let activities = [];
    if (req.body.activities) {
      if (Array.isArray(req.body.activities)) {
        activities = req.body.activities;
      } else {
        try {
          activities = JSON.parse(req.body.activities);
        } catch {
          activities = req.body.activities.split(',').map(a => a.trim()).filter(Boolean);
        }
      }
    }

    // ✅ Extract itineraryDays[] from dynamically named keys (itineraryDay0, itineraryDay1, etc.)
    let itineraryDays = [];
    const count = parseInt(req.body.itineraryCount || 0);
    for (let i = 0; i < count; i++) {
      const key = `itineraryDay${i}`;
      if (req.body[key]) {
        itineraryDays.push(req.body[key].trim());
      }
    }

    const updateData = {
      name: req.body.name.trim(),
      slug: slugify(req.body.name, { lower: true, strict: true }),
      description: req.body.description,
      currency: req.body.currency || 'NPR',
      price: req.body.price,
      duration: Number(req.body.duration),
      activities,
      accommodation: req.body.accommodation,
      meals: req.body.meals,
      overview: req.body.overview,
      overviewHTML: req.body.overviewHTML || "",
      itineraryDays
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => f.relativePath || `/uploads/${f.filename}`);
    }

    const updatedTour = await Tour.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    console.log(`✅ Tour updated: ${updatedTour.name}`);
    res.json({
      ...updatedTour.toObject(),
      images: updatedTour.images?.map(img => img.replace(/\\/g, '/')) || []
    });
  } catch (err) {
    console.error("❌ Error updating tour:", err);
    res.status(400).json({ error: 'Failed to update tour', details: err.message });
  }
};

// ✅ Delete tour by ID
exports.deleteTour = async (req, res) => {
  try {
    const deleted = await Tour.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    console.log(`✅ Tour deleted: ${deleted.name}`);
    res.json({ message: 'Tour deleted' });
  } catch (err) {
    console.error("❌ Error deleting tour:", err);
    res.status(400).json({ error: 'Failed to delete tour', details: err.message });
  }
};
