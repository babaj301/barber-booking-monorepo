import bcrypt from 'bcrypt';
import { query } from '../db';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../middleware/authMiddleware';

export async function registerToken(
  name: string,
  email: string,
  password: string,
  user_role: string,
  rounds: number,
) {
  const hashedPassword = await bcrypt.hash(password, rounds);

  const result = await query(
    `INSERT INTO Users(name, email, password_hash, user_role) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, user_role || 'client'],
  );

  const newUser = result.rows[0];
  delete newUser.password_hash;

  return newUser;
}

export async function loginUser(email: string, password: string) {
  // 1. Database look up
  const existingUser = await query(`SELECT * FROM Users WHERE email = $1`, [
    email,
  ]);

  // 2. Instead of res.status, throw an explicit error
  if (existingUser.rows.length <= 0) {
    throw new Error('Invalid credentials');
  }

  const userToSend = existingUser.rows[0];

  // 3. Verify password
  const isMatch = await bcrypt.compare(password, userToSend.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 4. Generate payload and token and refresh token
  const payload = {
    userId: userToSend.id,
    email: userToSend.email,
    user_role: userToSend.user_role,
  };

  const token = generateAccessToken(payload);

  const refreshToken = generateRefreshToken({
    id: userToSend.id,
    email: userToSend.email,
    user_role: userToSend.user_role
  });

  // 5. Return clean data back to the controller
  return {
    token,
    user: {
      id: userToSend.id,
      email: userToSend.email,
      role: userToSend.user_role,
    },
    refreshToken,
  };
}

export async function refreshTokenService(refreshToken: string) {
  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET || 'fallback_development_key',
    ) as any;

    // Fetch fresh user data from database
    const userResult = await query(
      `SELECT id, email, user_role FROM Users WHERE id = $1`,
      [decodedToken.id],
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    return userResult.rows[0];
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
}
