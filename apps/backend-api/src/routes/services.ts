import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import { getServicesController } from '../controllers/services.controller';
import { get } from 'http';

const router = express.Router();

router.get('/', getServicesController);
