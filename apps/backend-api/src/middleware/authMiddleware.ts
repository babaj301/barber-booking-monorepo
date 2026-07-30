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
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error('No secret key found');
  }
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

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Guard clause: Ensure user was set by authenticateToken
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // 2. Check if the user's role is inside the allowed array
    if (!allowedRoles.includes(req.user.user_role)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient permissions' });
    }

    // 3. Role is allowed, proceed to the next middleware/route handler
    return next();
  };
}

export function generateAccessToken(user: any) {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('No access secret found');
  }
  return jwt.sign(user, secretKey, { expiresIn: '30m' });
}

export function generateRefreshToken(user: any) {
  const refreshSecret = process.env.REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('No refresh secret found');
  }
  return jwt.sign(
    { id: user.id, email: user.email, user_role: user.user_role },
    refreshSecret,
    {
      expiresIn: '7d',
    },
  );
}
