import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { getEmployees, getEmployeeById } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', protect, allowRoles('admin'), getEmployees);
router.get('/:id', protect, allowRoles('admin'), getEmployeeById);

export default router;