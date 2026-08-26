import 'dotenv/config';
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import { createAppointmentController } from '../controllers/appointments.controller';


const router = express.Router();

router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  createAppointmentController,
);

export default router;
