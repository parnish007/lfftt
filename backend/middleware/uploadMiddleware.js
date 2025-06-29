const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ✅ Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = 'lfftt-uploads';
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    return {
      folder,
      public_id: `${timestamp}-${safeName}`,
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
    };
  }
});

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/quicktime'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG, JPEG, MP4, MOV files are allowed.'), false);
  }
};

// ✅ Multer upload setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max
});

module.exports = {
  single: field => (req, res, next) => {
    upload.single(field)(req, res, err => {
      if (err) {
        console.error('❌ Upload error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },

  array: (field, maxCount) => (req, res, next) => {
    upload.array(field, maxCount)(req, res, err => {
      if (err) {
        console.error('❌ Upload error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },

  fields: specs => (req, res, next) => {
    upload.fields(specs)(req, res, err => {
      if (err) {
        console.error('❌ Upload error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }
};
