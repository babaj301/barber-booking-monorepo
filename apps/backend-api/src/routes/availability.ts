import { Router } from 'express';
import {
  createExceptionController,
  deleteExceptionController,
  getAvailableSlotsController,
} from '../controllers/availability.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public route to fetch open slots for front-end booking calendars
router.get('/slots', getAvailableSlotsController);

// Protected routes for barbers/admins to manage schedule exceptions
router.post('/exceptions', authenticateToken, createExceptionController);
router.delete('/exceptions/:id', authenticateToken, deleteExceptionController);

export default router;