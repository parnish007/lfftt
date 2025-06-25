const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tourController');

const upload = require('../middleware/uploadMiddleware');

// 🔹 GET all tours (for frontend tour list)
router.get('/', getAllTours);

// 🔹 GET single tour by slug (for tour detail page and editing)
router.get('/:slug', getTourBySlug);

// 🔹 POST create new tour with up to 10 images
router.post('/', upload.array('images', 10), createTour);

// ✅ PATCH update tour using slug (used by edit-tour.js)
router.patch('/:slug', upload.array('images', 10), updateTour);

// 🔹 DELETE a tour by ID
router.delete('/:id', deleteTour);

module.exports = router;
