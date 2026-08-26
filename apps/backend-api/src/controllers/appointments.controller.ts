import { NextFunction, Response } from 'express';
import { createAppointmentService } from '../services/appointments.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { client_id, barber_id, service_id, start_time } = req.body;

    if (!client_id || !barber_id || service_id.length === 0 || !start_time) {
      throw new Error('Incomplete credentials');
    }

    const newAppointment = await createAppointmentService({
      client_id,
      barber_id,
      service_id,
      start_time,
    });

    return res.status(201).json({
      message: 'Appointment created successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
