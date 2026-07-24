import 'dotenv/config';
import express from 'express';

import {
  getBarbersController,
  createBarbersController,
  getBarbersByIdController,
  deleteBarberController,
  editBarberController,
  reactivateBarberController,
} from '../controllers/barbers.controller';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getBarbersController);
router.get('/:id', getBarbersByIdController);

router.patch(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  editBarberController,
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  deleteBarberController,
);

router.post(
  '/',
  authenticateToken,
  requireRole(['admin', 'barber']),
  createBarbersController,
);

router.post(
  '/reactivate/:id',
  authenticateToken,
  requireRole(['admin']),
  reactivateBarberController,
);

export default router;
