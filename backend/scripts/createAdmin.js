const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('../models/Admin'); // 🔁 Make sure this path is correct

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const phone = '9847309013'; // ✅ CHANGE this if needed
    const plainPassword = 'Ratorani12@+'; // ✅ CHANGE this securely
    const name = 'Admin';

    const existingAdmin = await Admin.findOne({ phone });
    if (existingAdmin) {
      console.log('⚠️ Admin with this phone already exists.');
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newAdmin = new Admin({
      name,
      phone,
      password: hashedPassword
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
