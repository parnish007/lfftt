const Tour = require('../models/Tour');
const slugify = require('slugify');

// ✅ Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
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
    res.json(tour);
  } catch (err) {
    console.error("❌ Error fetching tour by slug:", err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// ✅ Create a new tour with currency
exports.createTour = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const newTour = new Tour({
      name: req.body.name.trim(),
      slug: slugify(req.body.name, { lower: true, strict: true }),
      description: req.body.description,
      currency: req.body.currency || 'NPR', // ✅ currency from form
      price: Number(req.body.price),
      duration: Number(req.body.duration),
      activities: JSON.parse(req.body.activities || '[]'),
      accommodation: req.body.accommodation,
      meals: req.body.meals,
      overview: req.body.overview,
      images
    });

    await newTour.save();
    console.log(`✅ New tour saved: ${newTour.name}`);
    res.status(201).json(newTour);
  } catch (err) {
    console.error("❌ Error creating tour:", err);
    res.status(400).json({ error: 'Failed to create tour', details: err.message });
  }
};

// ✅ Update an existing tour with currency
exports.updateTour = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      currency: req.body.currency || 'NPR', // ✅ added
      price: Number(req.body.price),
      duration: Number(req.body.duration),
      activities: Array.isArray(req.body.activities)
        ? req.body.activities
        : typeof req.body.activities === 'string'
          ? req.body.activities.split(',').map(item => item.trim())
          : []
    };

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedTour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    console.log(`✅ Tour updated: ${updatedTour.name}`);
    res.json(updatedTour);
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
