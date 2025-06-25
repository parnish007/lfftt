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

// 🔹 GET all tours
router.get('/', getAllTours);

// 🔹 GET single tour by slug
router.get('/:slug', getTourBySlug);

// 🔹 POST: Create new tour (accepts up to 10 images)
router.post('/', upload.array('images', 10), createTour);

// 🔹 PATCH: Update tour using slug
router.patch('/:slug', upload.array('images', 10), updateTour);

// 🔹 DELETE: Remove tour by ID
router.delete('/:id', deleteTour);

module.exports = router;
