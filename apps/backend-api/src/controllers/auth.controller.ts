import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { registerToken, loginUser } from '../services/auth.service';

import jwt from 'jsonwebtoken';
import { query } from '../db';
import bcrypt from 'bcrypt';

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

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (err) {
    console.error('Error creating user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Call the service and await its returned token payload
    const result = await loginUser(email, password);

    // If no errors were thrown, return a 200 OK with the token data
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'server error during login',
    });
    // Hand unexpected errors (e.g., database connection failure) to global error middleware
    next(error);
  }
};
