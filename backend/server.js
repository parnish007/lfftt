const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ✅ Cloudinary ping check
const cloudinary = require('./config/cloudinary');
cloudinary.api.ping((err, res) => {
  if (err) {
    console.error("❌ Cloudinary connection failed:", err.message);
  } else {
    console.log("✅ Cloudinary connected:", res);
  }
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// ✅ Force HTTPS (Render-specific)
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files from /public root (for sitemap.xml, robots.txt, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Serve specific static folders from /public
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/bills', express.static(path.join(__dirname, '../public/bills')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/images/tour-packages', express.static(path.join(__dirname, '../public/images/tour-packages')));
app.use(express.static(path.join(__dirname, '../src'))); // Serve frontend files

// ✅ MongoDB connection
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

// ✅ WebSocket
require('./socket')(io);

// ✅ Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/html/index.html'));
});

// ✅ Dynamic .html file handler
app.get('/*.html', (req, res, next) => {
  const file = path.basename(req.path);
  const tryPaths = [
    path.join(__dirname, '../src/html', file),
    path.join(__dirname, '../src/html/tour', file),
    path.join(__dirname, '../src/html/vehicle', file),
    path.join(__dirname, '../src/html/vehicles', file),
    path.join(__dirname, '../src/html/tours', file),
    path.join(__dirname, '../src/html/admin', file)
  ];

  let i = 0;
  const tryNext = () => {
    if (i >= tryPaths.length) return next();
    const currentPath = tryPaths[i++];
    res.sendFile(currentPath, (err) => {
      if (err) {
        console.warn(`⚠ Not found: ${currentPath}`);
        tryNext();
      }
    });
  };

  tryNext();
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
