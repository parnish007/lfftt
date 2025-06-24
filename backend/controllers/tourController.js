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
    console.log("➡ Received body:", req.body);
    console.log("➡ Received files:", req.files);

    const images = req.files
      ? req.files.map(file => file.relativePath || `/uploads/${file.filename}`)
      : [];

    const activities = req.body.activities
      ? (Array.isArray(req.body.activities)
        ? req.body.activities
        : JSON.parse(req.body.activities))
      : [];

    const newTour = new Tour({
      name: req.body.name.trim(),
      slug: slugify(req.body.name, { lower: true, strict: true }),
      description: req.body.description,
      currency: req.body.currency || 'NPR',
      price: Number(req.body.price),
      duration: Number(req.body.duration),
      activities,
      accommodation: req.body.accommodation,
      meals: req.body.meals,
      overview: req.body.overview,
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

// ✅ Update a tour (with optional image update)
exports.updateTour = async (req, res) => {
  try {
    console.log("➡ Update body:", req.body);
    console.log("➡ Update files:", req.files);

    const activities = req.body.activities
      ? (Array.isArray(req.body.activities)
        ? req.body.activities
        : JSON.parse(req.body.activities))
      : [];

    const updateData = {
      ...req.body,
      currency: req.body.currency || 'NPR',
      price: Number(req.body.price),
      duration: Number(req.body.duration),
      activities
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => f.relativePath || `/uploads/${f.filename}`);
    }

    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, updateData, { new: true });

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

// ✅ Delete a tour
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
