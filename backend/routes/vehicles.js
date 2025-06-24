const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getAllVehicles,
  getVehicleBySlug,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

// ✅ GET all vehicles
router.get('/', getAllVehicles);

// ✅ GET single vehicle by slug
router.get('/:slug', getVehicleBySlug);

// ✅ POST create new vehicle with images/videos
router.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
  ]),
  createVehicle
);

// ✅ PUT update vehicle with optional images/videos
router.put(
  '/:id',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
  ]),
  updateVehicle
);

// ✅ DELETE vehicle by ID
router.delete('/:id', deleteVehicle);

module.exports = router;
