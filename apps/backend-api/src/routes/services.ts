import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  getServicesController,
  getServiceByIdController,
  createServiceController,
  editServiceController,
  deleteServiceController,
  reactivateServiceController,
} from '../controllers/services.controller';

const router = express.Router();

router.get('/', getServicesController);

router.get('/:id', getServiceByIdController);

router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  createServiceController,
);

router.patch(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  editServiceController,
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  deleteServiceController,
);

router.patch(
  '/reactivate/:id',
  authenticateToken,
  requireRole(['admin']),
  reactivateServiceController,
);

export default router;
