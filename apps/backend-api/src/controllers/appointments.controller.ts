import { NextFunction, Response } from 'express';
import { createAppointmentService, getAppointmentById, getAppointments } from '../services/appointments.service';
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

export const getAppointmentByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    const appointment = await getAppointmentById(id);
    res.status(200).json({
      appointment,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find appointment',
    });
  }
};

export const getAppointmentsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointments = await getAppointments();
    res.status(200).json({
      appointments,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find appointments',
    });
  }
};
