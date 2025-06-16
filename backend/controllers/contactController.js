const ContactMessage = require('../models/ContactMessage');

// Create a new contact message
exports.createMessage = async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    await message.save();
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(400).json({ success: false, error: 'Failed to send message' });
  }
};

// Get all messages (admin view)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(400).json({ success: false, error: 'Failed to delete message' });
  }
};
