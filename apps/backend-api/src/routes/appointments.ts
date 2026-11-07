import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  getAppointmentsController,
  getAppointmentByIdController,
  createAppointmentController,
  cancelAppointmentController,
  updateAppointmentStatusController,
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

router.patch(
  '/:id/cancel',
  authenticateToken,
  requireRole(['client', 'admin', 'barber']),
  cancelAppointmentController,
);

router.patch(
  '/:id',
  authenticateToken,
  requireRole(['client', 'admin', 'barber']),
  updateAppointmentStatusController,
);

export default router;
