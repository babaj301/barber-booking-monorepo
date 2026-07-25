import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  getServicesController,
  getServiceByIdController,
  createServiceController,
  editServiceController,
  deleteServiceController,
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


export default router;
