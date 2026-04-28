import express from 'express';
import {
  createMetaEntry,
  getMetaEntries,
  updateMetaEntry,
  deleteMetaEntry
} from '../controllers/metaAdsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMetaEntries);
router.post('/', protect, createMetaEntry);
router.put('/:id', protect, updateMetaEntry);
router.delete('/:id', protect, deleteMetaEntry);

export default router;