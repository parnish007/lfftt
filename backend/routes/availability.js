const express = require('express');
const router = express.Router();
const { updateAvailability, getAvailability } = require('../controllers/availabilityController');

// ✅ PUT /api/availability/:type/:id — Update availability (type = tour or vehicle)
router.put('/:type/:id', updateAvailability);

// ✅ GET /api/availability/:type/:id — Get availability info
router.get('/:type/:id', getAvailability);

module.exports = router;
