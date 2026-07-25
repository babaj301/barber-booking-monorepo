import { NextFunction, Request, Response } from 'express';
import { getServices } from '../services/services.service';

export async function getServicesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { search } = req.query;
    if (search) {
      const services = await getServices(search as string);
      res.status(200).json({
        services,
      });
    } else {
      const services = await getServices();
      res.status(200).json({
        services,
      });
    }
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find services',
    });
  }
}


