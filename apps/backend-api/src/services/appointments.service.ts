import { query } from '../db';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

const VALID_STATUSES: AppointmentStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
];

async function assertAppointmentAccess(
  id: number,
  actorUserId: number,
  actorRole: 'client' | 'barber' | 'admin',
) {
  const appointment = await query(
    `SELECT id, client_id, barber_id, current_status, service_id
     FROM appointments
     WHERE id = $1`,
    [id],
  );

  if (appointment.rowCount === 0) {
    throw new Error('Appointment does not exist');
  }

  const record = appointment.rows[0];

  if (actorRole === 'admin') {
    return record;
  }

  if (actorRole === 'client' && record.client_id !== actorUserId) {
    throw new Error('Forbidden: appointment does not belong to this client');
  }

  if (actorRole === 'barber' && record.barber_id !== actorUserId) {
    throw new Error('Forbidden: appointment does not belong to this barber');
  }

  return record;
}

export async function getAllAppointments() {
  const appointments = await query(
    `SELECT a.*
     FROM appointments a
     ORDER BY a.start_time ASC`,
  );

  return appointments.rows;
}

export async function getAppointmentById(id: number) {
  const appointment = await query(
    `SELECT a.*
     FROM appointments a
     WHERE a.id = $1`,
    [id],
  );

  if (appointment.rowCount === 0) {
    throw new Error('Appointment does not exist');
  }

  return appointment.rows[0];
}

export async function createAppointment(
  clientId: number,
  barberId: number,
  serviceID: number,
  startTime: string,
) {
  const start = new Date(startTime);

  if (Number.isNaN(start.getTime())) {
    throw new Error('Invalid start time');
  }

  if (start <= new Date()) {
    throw new Error('Start time must be in the future');
  }

  const client = await query(`SELECT id FROM users WHERE id = $1`, [clientId]);
  if (client.rowCount === 0) {
    throw new Error('Client not found');
  }

  const barber = await query(
    `SELECT id FROM barbers WHERE id = $1 AND is_active = true`,
    [barberId],
  );
  if (barber.rowCount === 0) {
    throw new Error('Barber not found');
  }

  const service = await query(
    `SELECT id, duration_minutes FROM services WHERE id = $1 AND is_active = true`,
    [serviceID],
  );

  if (service.rowCount === 0) {
    throw new Error('Service not found');
  }

  const durationMinutes = Number(service.rows[0].duration_minutes);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const overlapResult = await query(
    `SELECT id
     FROM appointments
     WHERE barber_id = $1
       AND current_status <> 'cancelled'
       AND start_time < $3::timestamptz
       AND end_time > $2::timestamptz
     LIMIT 1`,
    [barberId, start.toISOString(), end.toISOString()],
  );

  if ((overlapResult.rowCount ?? 0) > 0) {
    throw new Error('Barber is not available at that time');
  }

  const result = await query(
    `INSERT INTO appointments (
       client_id,
       barber_id,
       service_id,
       start_time,
       end_time,
       current_status
     )
     VALUES ($1::int, $2::int, $3::int, $4::timestamptz, $5::timestamptz, 'confirmed')
     RETURNING *`,
    [clientId, barberId, serviceID, start.toISOString(), end.toISOString()],
  );

  const appointment = result.rows[0];

  if (!appointment) {
    throw new Error('Unable to create appointment');
  }

  const joinCheck = await query(
    `SELECT 1 FROM appointment_services WHERE appointment_id = $1 AND service_id = $2`,
    [appointment.id, serviceID],
  );

  if (joinCheck.rowCount === 0) {
    await query(
      `INSERT INTO appointment_services (appointment_id, service_id)
       VALUES ($1::int, $2::int)`,
      [appointment.id, serviceID],
    );
  }

  return appointment;
}

export async function cancelAppointment(
  id: number,
  actorUserId: number,
  actorRole: 'client' | 'barber' | 'admin',
) {
  const appointment = await assertAppointmentAccess(id, actorUserId, actorRole);

  if (appointment.current_status === 'cancelled') {
    throw new Error('Appointment is already cancelled');
  }

  const result = await query(
    `UPDATE appointments
     SET current_status = 'cancelled'
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows[0];
}

export async function updateAppointmentStatus(
  id: number,
  currentStatus: AppointmentStatus,
  actorUserId: number,
  actorRole: 'client' | 'barber' | 'admin',
) {
  if (!VALID_STATUSES.includes(currentStatus)) {
    throw new Error('Invalid appointment status');
  }

  const appointment = await assertAppointmentAccess(id, actorUserId, actorRole);

  if (
    appointment.current_status === 'cancelled' &&
    currentStatus !== 'cancelled'
  ) {
    throw new Error('Cancelled appointment cannot be reactivated');
  }

  const result = await query(
    `UPDATE appointments
     SET current_status = $2
     WHERE id = $1
     RETURNING *`,
    [id, currentStatus],
  );

  return result.rows[0];
}
