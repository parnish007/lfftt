const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    let account = await Admin.findOne({ phone });
    let role = 'admin';

    if (!account) {
      account = await User.findOne({ phone });
      role = 'customer';
    }

    if (!account) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.status(200).json({
      token,
      role,
      user: {
        id: account._id,
        name: account.name,
        phone: account.phone
      }
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Optional user registration
exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(400).json({ message: 'Registration failed' });
  }
};
 