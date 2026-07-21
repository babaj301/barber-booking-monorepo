import { error } from 'console';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    user_role: 'client' | 'barber' | 'admin';
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const splitHeader = authHeader.split(' ');

  if (splitHeader.length !== 2 || splitHeader[0] !== 'Bearer') {
    return res
      .status(401)
      .json({ error: 'Token format must be "Bearer <token>"' });
  }

  const token = splitHeader[1];
  const secretKey = process.env.JWT_SECRET || 'fallback_development_key';
  try {
    const decoded = jwt.verify(
      token,
      secretKey,
    ) as AuthenticatedRequest['user'];
    req.user = decoded;


    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid or expired token',
    });
  }
};
