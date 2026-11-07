import { NextFunction, Request, Response } from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
} from '../services/appointments.service';

export async function getAppointmentsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const appointments = await getAllAppointments();
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(404).json({ message: 'Couldnt find appointments' });
  }
}

export async function getAppointmentByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const appointment = await getAppointmentById(id);
    return res.status(200).json({ appointment });
  } catch (error) {
    return res.status(404).json({ message: 'Couldnt find appointment' });
  }
}

export async function createAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { client_id, barber_id, service_id, start_time } = req.body;

    if (!client_id || !barber_id || !service_id || !start_time) {
      return res
        .status(400)
        .json({ message: 'Missing required appointment fields' });
    }

    const appointment = await createAppointment(
      Number(client_id),
      Number(barber_id),
      Number(service_id),
      String(start_time),
    );

    return res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error: any) {
    if (
      error?.message === 'Start time must be in the future' ||
      error?.message === 'Invalid start time' ||
      error?.message === 'Service not found'
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
