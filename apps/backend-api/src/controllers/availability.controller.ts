import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import {
  createBarberExceptionService,
  deleteBarberExceptionService,
  getAvailableTimeSlotsService,
} from '../services/availability.service';

export const createExceptionController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      barber_id,
      exception_date,
      is_day_off,
      start_time,
      end_time,
      reason,
    } = req.body;

    if (!barber_id || !exception_date || is_day_off === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const exception = await createBarberExceptionService({
      barber_id,
      exception_date,
      is_day_off,
      start_time,
      end_time,
      reason,
    });

    return res.status(201).json({
      message: 'Exception saved successfully',
      exception,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || 'Internal server error' });
  }
};

export const deleteExceptionController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const exceptionId = parseInt(req.params.id, 10);
    const { barber_id } = req.body;

    if (isNaN(exceptionId) || !barber_id) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    await deleteBarberExceptionService(exceptionId, barber_id);

    return res.status(200).json({ message: 'Exception deleted successfully' });
  } catch (error: any) {
    return res
      .status(404)
      .json({ error: error.message || 'Exception not found' });
  }
};

export const getAvailableSlotsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const barberId = parseInt(req.query.barber_id as string, 10);
    const dateStr = req.query.date as string;
    const duration = parseInt(req.query.duration as string, 10) || 30;

    if (!barberId || !dateStr) {
      return res
        .status(400)
        .json({ error: 'barber_id and date query parameters are required' });
    }

    const slots = await getAvailableTimeSlotsService(
      barberId,
      dateStr,
      duration,
    );

    return res.status(200).json({
      barber_id: barberId,
      date: dateStr,
      slots,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: 'Failed to generate available slots' });
  }
};
