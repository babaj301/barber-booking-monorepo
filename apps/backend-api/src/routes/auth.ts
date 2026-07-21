import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { registerToken } from '../services/authService';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import bcrypt from 'bcrypt';
import {
  authenticateToken,
  AuthenticatedRequest,
} from '../middleware/authMiddleware';
const router = express.Router();

router.post('/register', authenticateToken, async (req, res) => {
  const { name, email, password, user_role } = req.body;
  const saltRounds = 10;
  try {
    const newUser = await registerToken(
      name,
      email,
      password,
      user_role,
      saltRounds,
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (err) {
    console.error('Error creating user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await query(`SELECT * FROM Users WHERE email = $1`, [
      email,
    ]);
    if (existingUser.rows.length <= 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userToSend = existingUser.rows[0];

    const isMatch = await bcrypt.compare(password, userToSend.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: userToSend.id,
      email: userToSend.email,
      user_role: userToSend.user_role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_development_key',
      {
        expiresIn: '1h',
      },
    );

    return res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      message: 'server error during login',
    });
  }
});

// Protected route: returns current authenticated user metadata
router.get(
  '/me',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: 'Access granted to protected route',
      user: req.user,
    });
  },
);

export default router;
