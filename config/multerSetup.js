const multer= require('multer')

// Define storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/adminAssets/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now()+file.originalname);
    }
  });

  // Create multer instance with specified storage settings
  console.log("==============");
const upload = multer({ storage: storage });

module.exports = upload; // Export the configured Multer instance
