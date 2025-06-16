// backend/socket.js

const ChatMessage = require('./models/ChatMessage');
const { default: mongoose } = require('mongoose');

const activeUsers = new Map(); // userId => socket.id
let adminSocketId = null;

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 New socket connected:', socket.id);

    // USER CONNECT
    socket.on('user-connected', (userId) => {
      activeUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(`👤 User ${userId} connected`);
    });

    // ADMIN CONNECT
    socket.on('admin-connected', () => {
      adminSocketId = socket.id;
      console.log(`🛡️ Admin connected as ${adminSocketId}`);
    });

    // USER → ADMIN MESSAGE
    socket.on('send-to-admin', async ({ userId, message }) => {
      if (!message || !userId) return;
      const newMsg = await ChatMessage.create({
        senderId: userId,
        senderModel: 'User',
        receiverId: null,
        receiverModel: 'Admin',
        message
      });

      // Send to admin
      if (adminSocketId) {
        io.to(adminSocketId).emit('receive-message', {
          from: userId,
          message
        });
      }
    });

    // ADMIN → USER MESSAGE
    socket.on('send-to-user', async ({ to, message }) => {
      if (!message || !to) return;

      await ChatMessage.create({
        senderId: null,
        senderModel: 'Admin',
        receiverId: to,
        receiverModel: 'User',
        message
      });

      const userSocketId = activeUsers.get(to);
      if (userSocketId) {
        io.to(userSocketId).emit('receive-message', {
          from: 'admin',
          message
        });
      }
    });

    // Clean up
    socket.on('disconnect', () => {
      for (const [userId, sockId] of activeUsers.entries()) {
        if (sockId === socket.id) {
          activeUsers.delete(userId);
          console.log(`🔴 User ${userId} disconnected`);
        }
      }
      if (socket.id === adminSocketId) {
        console.log('🔴 Admin disconnected');
        adminSocketId = null;
      }
    });
  });
};

