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
      res.json({
        ...v.toObject(),
        images: v.images?.map(f => f.replace(/\\/g, '/')) || [],
        videos: v.videos?.map(f => f.replace(/\\/g, '/')) || []
      });
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
      currency
    } = req.body;

    if (!name || !vehicleType || !seatingCapacity || !pricePerDay) {
      console.warn("⚠ Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const images = req.files?.images?.map(f => f.relativePath || `/uploads/${f.filename}`) || [];
    const videos = req.files?.videos?.map(f => f.relativePath || `/uploads/${f.filename}`) || [];

    console.log("📦 Creating vehicle with:", { name, images, videos });

    const vehicle = new Vehicle({
      slug,
      name: name.trim(),
      vehicleType: vehicleType.trim(),
      seatingCapacity: Number(seatingCapacity),
      currency: currency || 'NPR',
      pricePerDay: pricePerDay?.toString().trim(),
      description: description?.trim(),
      origin: origin?.trim(),
      destination: destination?.trim(),
      images,
      videos
    });

    await vehicle.save();
    console.log(`✅ Vehicle saved to DB: ${vehicle.name} (ID: ${vehicle._id})`);
    res.status(201).json({
      ...vehicle.toObject(),
      images: vehicle.images?.map(f => f.replace(/\\/g, '/')) || [],
      videos: vehicle.videos?.map(f => f.replace(/\\/g, '/')) || []
    });
  } catch (err) {
    console.error("❌ Error creating vehicle:", err);
    res.status(500).json({ error: "Create failed", details: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      currency: req.body.currency || 'NPR'
    };

    if (req.body.pricePerDay) {
      updateData.pricePerDay = req.body.pricePerDay.toString().trim();
    }

    if (req.files?.images?.length) {
      updateData.images = req.files.images.map(f => f.relativePath || `/uploads/${f.filename}`);
    }

    if (req.files?.videos?.length) {
      updateData.videos = req.files.videos.map(f => f.relativePath || `/uploads/${f.filename}`);
    }

    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    console.log(`✅ Vehicle updated: ${updated.name} (ID: ${updated._id})`);
    res.json({
      ...updated.toObject(),
      images: updated.images?.map(f => f.replace(/\\/g, '/')) || [],
      videos: updated.videos?.map(f => f.replace(/\\/g, '/')) || []
    });
  } catch (err) {
    console.error("❌ Error updating vehicle:", err);
    res.status(400).json({ error: "Failed to update vehicle", details: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    console.log(`✅ Vehicle deleted: ${req.params.id}`);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    console.error("❌ Error deleting vehicle:", err);
    res.status(400).json({ error: "Failed to delete vehicle", details: err.message });
  }
};
