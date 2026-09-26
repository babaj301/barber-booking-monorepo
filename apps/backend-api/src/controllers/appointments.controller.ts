import { NextFunction, Response } from 'express';
import {
  createAppointmentService,
  SlotTakenError,
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
    const userId = req.user?.id ?? req.user?.userId ?? req.body.userId;
    const { barberId, startIso, endIso } = req.body;

    if (!userId || !barberId || !startIso || !endIso) {
      return res
        .status(400)
        .json({ error: 'userId, barberId, startIso, and endIso are required' });
    }

    const appointment = await createAppointmentService({
      userId,
      barberId,
      startIso,
      endIso,
    });

    return res.status(201).json(appointment);
  } catch (error: any) {
    if (error instanceof SlotTakenError || error.code === 'SLOT_TAKEN') {
      return res.status(409).json({ error: 'Time slot already booked' });
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

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
