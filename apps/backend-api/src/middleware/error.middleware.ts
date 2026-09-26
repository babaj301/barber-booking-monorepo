import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pgCode = error?.code;

  if (pgCode === '23P01' || pgCode === '23505') {
    return res.status(409).json({ error: 'Slot no longer available' });
  }

  return res.status(500).json({ error: 'Internal server error' });
};
