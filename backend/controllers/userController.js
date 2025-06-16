const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.updateUserProfile = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
