import { NextFunction, Response } from 'express';
import {
  createAppointmentService,
  getAppointmentById,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '../services/appointments.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { client_id, barber_id, service_id, start_time } = req.body;

    if (!client_id || !barber_id || !Array.isArray(service_id) || service_id.length === 0 || !start_time) {
      const validationError: any = new Error('Incomplete credentials');
      validationError.statusCode = 400;
      throw validationError;
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
  } catch (error: any) {
    console.error('Error creating appointment', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
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
    if (!appointment) {
      return res.status(404).json({ message: "Couldn't find appointment" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAppointmentsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointments = await getAppointments();
    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAppointmentStatusController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const appointment = await updateAppointmentStatus(id, status);
    if (!appointment) {
      return res.status(404).json({ message: "Couldn't find appointment" });
    }
    res.status(200).json({
      message: 'Appointment status updated',
      appointment,
    });
  } catch (error) {
    console.error('Error updating appointment status', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    const appointment = await deleteAppointment(id);
    if (!appointment) {
      return res.status(404).json({ message: "Couldn't find appointment" });
    }
    res.status(200).json({
      message: 'Appointment deleted',
      appointment,
    });
  } catch (error) {
    console.error('Error deleting appointment', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};