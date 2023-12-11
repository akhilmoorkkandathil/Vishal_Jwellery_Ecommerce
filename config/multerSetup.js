const multer= require('multer')

// Define storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/adminAssets/uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
    }
  });

  // Create multer instance with specified storage settings
const upload = multer({ storage: storage });

module.exports = upload; // Export the configured Multer instance
