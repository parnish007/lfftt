// backend/routes/availability.js

const express = require('express');
const router = express.Router();
const { updateAvailability, getAvailability } = require('../controllers/availabilityController');

// PUT /api/availability/:type/:id
router.put('/:type/:id', updateAvailability); // type = tour or vehicle

// GET /api/availability/:type/:id
router.get('/:type/:id', getAvailability);

module.exports = router;

