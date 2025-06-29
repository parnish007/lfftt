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

// 🔹 POST: Create new tour (Cloudinary image support via middleware)
router.post('/', upload.array('images', 10), createTour);

// 🔹 PATCH: Update tour by slug (Cloudinary image support)
router.patch('/:slug', upload.array('images', 10), updateTour);

// 🔹 DELETE: Remove tour by ID
router.delete('/:id', deleteTour);

module.exports = router;
