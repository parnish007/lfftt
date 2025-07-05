const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const admin = await Admin.findOne({ phone });
    const user = await User.findOne({ phone });

    const account = admin || user;
    if (!account) return res.status(404).json({ message: 'User not found' });

    const isMatch = await account.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const role = admin ? 'admin' : 'customer';
    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.json({
      token,
      role,
      user: {
        name: account.name,
        phone: account.phone
      }
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Registration kept for future (optional)
exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed' });
  }
};
