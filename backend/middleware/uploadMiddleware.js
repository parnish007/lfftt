const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const uniqueName = `${timestamp}-${safeName}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.mp4', '.mov'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    console.warn(`⚠ Upload blocked: unsupported file type ${ext}`);
    cb(new Error('Unsupported file type. Only PNG, JPG, JPEG, MP4, MOV allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

module.exports = {
  single: field => (req, res, next) => {
    upload.single(field)(req, res, err => {
      if (err) {
        console.error('❌ Upload error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      if (req.file) {
        req.file.relativePath = `/uploads/${req.file.filename}`;
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
      if (req.files) {
        req.files.forEach(file => {
          file.relativePath = `/uploads/${file.filename}`;
        });
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
      if (req.files) {
        Object.keys(req.files).forEach(field => {
          req.files[field].forEach(file => {
            file.relativePath = `/uploads/${file.filename}`;
          });
        });
      }
      next();
    });
  }
};
