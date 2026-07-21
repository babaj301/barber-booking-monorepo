import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';

import {
  registerUserController,
  loginUserController,
} from '../controllers/auth.controller';
import {
  authenticateToken,
  AuthenticatedRequest,
  requireRole,
} from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUserController);

router.post('/login', loginUserController);

// Protected route: returns current authenticated user metadata
router.get(
  '/me',
  authenticateToken,
  requireRole(['admin']),
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: 'Access granted to protected route',
      user: req.user,
    });
  },
);

export default router;
