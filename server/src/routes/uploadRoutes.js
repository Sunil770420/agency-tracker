import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfileImage } from '../controllers/uploadController.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/profile-image', protect, upload.single('image'), uploadProfileImage);

export default router;