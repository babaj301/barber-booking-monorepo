import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  getAppointmentsController,
  getAppointmentByIdController,
  createAppointmentController,
} from '../controllers/appointments.controller';

const router = express.Router();

router.get('/', getAppointmentsController);
router.get('/:id', getAppointmentByIdController);

router.post(
  '/',
  authenticateToken,
  requireRole(['client', 'admin']),
  createAppointmentController,
);

export default router;
