import { NextFunction, Request, Response } from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  cancelAppointment,
  updateAppointmentStatus,
} from '../services/appointments.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

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
  req: AuthenticatedRequest,
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

    const actorUserId = req.user?.userId;
    const actorRole = req.user?.user_role;

    if (!actorUserId || !actorRole) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (actorRole !== 'admin' && Number(client_id) !== actorUserId) {
      return res
        .status(403)
        .json({ message: 'You can only create appointments for yourself' });
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
      error?.message === 'Service not found' ||
      error?.message === 'Barber is not available at that time' ||
      error?.message === 'Client not found' ||
      error?.message === 'Barber not found'
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function cancelAppointmentController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const actorUserId = req.user?.userId;
    const actorRole = req.user?.user_role;

    if (!actorUserId || !actorRole) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const appointment = await cancelAppointment(id, actorUserId, actorRole);

    return res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error: any) {
    if (error?.message === 'Appointment does not exist') {
      return res.status(404).json({ message: error.message });
    }

    if (
      error?.message ===
        'Forbidden: appointment does not belong to this client' ||
      error?.message === 'Forbidden: appointment does not belong to this barber'
    ) {
      return res.status(403).json({ message: error.message });
    }

    if (error?.message === 'Appointment is already cancelled') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateAppointmentStatusController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const actorUserId = req.user?.userId;
    const actorRole = req.user?.user_role;

    if (!actorUserId || !actorRole) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Missing appointment status' });
    }

    const appointment = await updateAppointmentStatus(
      id,
      status,
      actorUserId,
      actorRole,
    );

    return res.status(200).json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error: any) {
    if (error?.message === 'Appointment does not exist') {
      return res.status(404).json({ message: error.message });
    }

    if (
      error?.message ===
        'Forbidden: appointment does not belong to this client' ||
      error?.message === 'Forbidden: appointment does not belong to this barber'
    ) {
      return res.status(403).json({ message: error.message });
    }

    if (
      error?.message === 'Invalid appointment status' ||
      error?.message === 'Cancelled appointment cannot be reactivated'
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
