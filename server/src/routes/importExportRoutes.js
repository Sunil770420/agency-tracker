import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test import/export route
router.get('/', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Import/Export route working'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;