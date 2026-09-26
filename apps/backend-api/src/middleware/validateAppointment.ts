import { NextFunction, Request, Response } from 'express';

export const validateBookingPayload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { barberId, startIso, endIso } = req.body ?? {};

  if (
    barberId === undefined ||
    barberId === null ||
    barberId === '' ||
    startIso === undefined ||
    startIso === null ||
    startIso === '' ||
    endIso === undefined ||
    endIso === null ||
    endIso === ''
  ) {
    return res
      .status(400)
      .json({ error: 'Invalid booking request parameters' });
  }

  const startOk = typeof startIso === 'string' && !isNaN(Date.parse(startIso));
  const endOk = typeof endIso === 'string' && !isNaN(Date.parse(endIso));

  if (!startOk || !endOk) {
    return res
      .status(400)
      .json({ error: 'Invalid booking request parameters' });
  }

  return next();
};
