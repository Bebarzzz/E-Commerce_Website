const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');

// Check if S3 is configured
const useS3 = process.env.S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

let storage;

if (useS3) {
  // Configure S3 client
  const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { 
        fieldName: file.fieldname,
        uploadedAt: new Date().toISOString()
      });
    },
    key: function (req, file, cb) {
      // Generate unique filename: uploads/cars/timestamp-originalname
      const uniqueFilename = `uploads/cars/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      cb(null, uniqueFilename);
    }
  });
} else {
  // Use local storage
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../upload'));
    },
    filename: function (req, file, cb) {
      const uniqueFilename = `uploads/cars/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      cb(null, uniqueFilename);
    }
  });
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

module.exports = upload;
