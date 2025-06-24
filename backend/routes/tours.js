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

// 🔹 GET single tour by slug (for tour detail page)
router.get('/:slug', getTourBySlug);

// 🔹 POST create new tour with up to 10 images
router.post('/', upload.array('images', 10), createTour);

// 🔹 PUT update tour details (future-proof: can accept images if needed)
router.put('/:id', upload.array('images', 10), updateTour);

// 🔹 DELETE a tour by ID
router.delete('/:id', deleteTour);

module.exports = router;
