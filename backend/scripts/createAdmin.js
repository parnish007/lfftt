const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('../models/Admin'); // ✅ Ensure this path is correct

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const phone = '9847309013'; // ✅ Update if needed
    const plainPassword = 'Ratorani12@+'; // ✅ Update if needed
    const name = 'Admin';

    const existingAdmin = await Admin.findOne({ phone });
    if (existingAdmin) {
      console.log('⚠️ Admin with this phone already exists.');
      return process.exit(0);
    }

    const newAdmin = new Admin({
      name,
      phone,
      password: plainPassword // 👉 Do NOT hash here — handled by Admin model
    });

    await newAdmin.save();
    console.log('✅ Admin created successfully.');
  } catch (err) {
    console.error('❌ Failed to create admin:', err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
