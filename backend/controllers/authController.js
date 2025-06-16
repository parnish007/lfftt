const Admin = require('../models/Admin');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const admin = await Admin.findOne({ phone });
    const user = await User.findOne({ phone });

    const account = admin || user;
    if (!account) return res.status(404).json({ error: 'User not found' });

    const match = await account.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const role = admin ? 'admin' : 'user';
    res.json({ id: account._id, name: account.name, role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
};
