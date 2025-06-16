const ChatMessage = require('../models/ChatMessage');

exports.getUserMessages = async (req, res) => {
  const { userId } = req.params;
  const messages = await ChatMessage.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  }).sort({ createdAt: 1 });
  res.json(messages);
};

exports.getAdminMessages = async (req, res) => {
  const messages = await ChatMessage.find({
    $or: [{ senderModel: 'Admin' }, { receiverModel: 'Admin' }]
  }).sort({ createdAt: 1 });
  res.json(messages);
};
