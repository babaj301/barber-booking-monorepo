import { NextFunction, Request, Response } from 'express';
import {
  getServices,
  createService,
  getServiceById,
  editService,
  deleteService,
} from '../services/services.service';

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

export async function getServiceByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const service = await getServiceById(id);
    res.status(200).json({
      service,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find service',
    });
  }
}

export async function createServiceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, price, durationMinutes, is_active } = req.body;
    const newService = await createService(
      name,
      price,
      durationMinutes,
      is_active,
    );
    return res
      .status(201)
      .json({ message: 'Service created succesfully', service: newService });
  } catch (error) {
    console.error('Error creating service', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function editServiceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const { name, price, durationMinutes, is_active } = req.body;
    const service = await editService(
      id,
      name,
      price,
      durationMinutes,
      is_active,
    );
    res.status(200).json({
      message: 'Service edited',
      service,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find service',
    });
  }
}

export async function deleteServiceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const service = await deleteService(id);
    res.status(200).json({
      message: 'Service deactivated',
      service,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find service',
    });
  }
}
