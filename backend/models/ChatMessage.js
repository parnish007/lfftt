// backend/models/ChatMessage.js

const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Admin']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'Admin']
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  attachmentUrl: {
    type: String  // e.g. /uploads/chat-files/file123.png
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

