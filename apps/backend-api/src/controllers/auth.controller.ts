// src/controllers/auth.controller.ts
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import {
  registerToken,
  loginUser,
  refreshTokenService,
} from '../services/auth.service';
import { generateAccessToken } from '../middleware/authMiddleware';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    return res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (err) {
    return next(err);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    return next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const user = await refreshTokenService(refreshToken);

    const newToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      user_role: user.user_role,
    });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};
