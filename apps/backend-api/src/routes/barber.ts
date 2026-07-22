import 'dotenv/config';
import express from 'express';

import {
  getBarbersController,
  createBarbersController,
} from '../controllers/barbers.controller';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getBarbersController);
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  createBarbersController,
);

export default router;
