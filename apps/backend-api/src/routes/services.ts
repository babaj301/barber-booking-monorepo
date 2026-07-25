import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  getServicesController,
  getServiceByIdController,
  createServiceController,
} from '../controllers/services.controller';
import { get } from 'http';

const router = express.Router();

router.get('/', getServicesController);

router.get('/:id', getServiceByIdController);

router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  createServiceController,
);

export default router;
