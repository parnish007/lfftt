const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static assets
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/bills', express.static(path.join(__dirname, '../public/bills')));
app.use(express.static(path.join(__dirname, '../src/html'))); // Serve frontend

// ✅ Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tours', require('./routes/tours'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/customize', require('./routes/customize'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/vehicle-bookings', require('./routes/vehicleBookings'));
app.use('/api/image-settings', require('./routes/imageSettings'));
app.use('/api/bills', require('./routes/bills'));

// ✅ WebSocket setup
require('./socket')(io);

// ✅ Root route → Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/html/index.html'));
});

// ✅ Handle 404 for unknown API routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  next();
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('✅ Uploads: http://localhost:' + PORT + '/uploads/{filename}');
  console.log('✅ PDFs:    http://localhost:' + PORT + '/bills/{filename}.pdf');
});
