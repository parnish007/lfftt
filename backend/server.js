const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// ✅ Serve static assets
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/bills', express.static(path.join(__dirname, '../public/bills')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use(express.static(path.join(__dirname, '../src')));

// ✅ Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ API routes
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

// ✅ Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/html/index.html'));
});

// ✅ Serve nested HTML files (support /tour/tour-detail.html, /vehicle/vehicle-detail.html, etc.)
app.get('/*.html', (req, res, next) => {
  const reqFile = req.path.replace(/^\//, '');
  const pathsToTry = [
    path.join(__dirname, '../src/html', reqFile),
    path.join(__dirname, '../src/html/tour', reqFile),
    path.join(__dirname, '../src/html/vehicle', reqFile),
    path.join(__dirname, '../src/html/admin', reqFile)
  ];

  let i = 0;
  const tryNext = () => {
    if (i >= pathsToTry.length) return next();
    const tryPath = pathsToTry[i++];
    res.sendFile(tryPath, (err) => {
      if (err) {
        console.warn(`⚠ Not found: ${tryPath}`);
        tryNext();
      }
    });
  };

  tryNext();
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
