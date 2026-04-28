import express from 'express';
import {
  createGoogleEntry,
  getGoogleEntries,
  updateGoogleEntry,
  deleteGoogleEntry
} from '../controllers/googleAdsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getGoogleEntries);
router.post('/', protect, createGoogleEntry);
router.put('/:id', protect, updateGoogleEntry);
router.delete('/:id', protect, deleteGoogleEntry);

export default router;