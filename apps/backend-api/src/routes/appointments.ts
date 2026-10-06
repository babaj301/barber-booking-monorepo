import 'dotenv/config';
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
} from '../controllers/appointments.controller';
import { validateBookingPayload } from '../middleware/validateAppointment';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  validateBookingPayload,
  createAppointmentController,
);

router.get(
  '/',
  authenticateToken,
  requireRole(['admin']),
  getAppointmentsController,
);

router.get(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  getAppointmentByIdController,
);

export default router;
