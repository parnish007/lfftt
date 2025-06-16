const Vehicle = require('../models/Vehicle');
const slugify = require('slugify');

exports.getAllVehicles = async (req, res) => {
  try {
    const data = await Vehicle.find().sort({ createdAt: -1 });

    const cleanedData = data.map(vehicle => ({
      ...vehicle.toObject(),
      images: vehicle.images?.map(f => f.replace(/\\/g, '/')) || [],
      videos: vehicle.videos?.map(f => f.replace(/\\/g, '/')) || []
    }));

    console.log(`✅ Sending ${cleanedData.length} vehicles to frontend.`);
    res.json(cleanedData);
  } catch (err) {
    console.error("❌ Error fetching vehicles:", err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

exports.getVehicleBySlug = async (req, res) => {
  try {
    const v = await Vehicle.findOne({ slug: req.params.slug });
    if (v) {
      console.log(`✅ Found vehicle by slug: ${v.slug}`);
      res.json(v);
    } else {
      console.warn(`⚠ No vehicle found for slug: ${req.params.slug}`);
      res.status(404).json({ error: "Vehicle not found" });
    }
  } catch (err) {
    console.error("❌ Error fetching vehicle by slug:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const {
      name,
      vehicleType,
      seatingCapacity,
      pricePerDay,
      description,
      origin,
      destination,
      currency // ✅ ADDED
    } = req.body;

    if (!name || !vehicleType || !seatingCapacity || !pricePerDay) {
      console.warn("⚠ Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const images = req.files?.images?.map(f => f.filename) || [];
    const videos = req.files?.videos?.map(f => f.filename) || [];

    console.log("📦 Creating vehicle with:");
    console.log("Name:", name);
    console.log("Images:", images);
    console.log("Videos:", videos);

    const vehicle = new Vehicle({
      slug,
      name,
      vehicleType,
      seatingCapacity: Number(seatingCapacity),
      currency: currency || 'NPR', // ✅ ADDED
      pricePerDay: Number(pricePerDay),
      description,
      origin,
      destination,
      images,
      videos
    });

    await vehicle.save();
    console.log(`✅ Vehicle saved to DB: ${vehicle.name} (ID: ${vehicle._id})`);
    res.status(201).json(vehicle);
  } catch (err) {
    console.error("❌ Error creating vehicle:", err);
    res.status(500).json({ error: "Create failed", details: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      currency: req.body.currency || 'NPR' // ✅ Ensure currency is kept or updated
    };

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log(`✅ Vehicle updated: ${updated.name} (ID: ${updated._id})`);
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating vehicle:", err);
    res.status(400).json({ error: "Failed to update vehicle" });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    console.log(`✅ Vehicle deleted: ${req.params.id}`);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    console.error("❌ Error deleting vehicle:", err);
    res.status(400).json({ error: "Failed to delete vehicle" });
  }
};
