import { query } from '../db';

export async function getAllAppointments() {
  const appointments = await query(
    `SELECT a.*, json_agg(aps.service_id) AS service_ids
     FROM appointments a
     LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
     GROUP BY a.id
     ORDER BY a.start_time ASC`,
  );

  if (appointments.rowCount === 0) {
    throw new Error('No appointments found');
  }

  return appointments.rows;
}

export async function getAppointmentById(id: number) {
  const appointment = await query(
    `SELECT a.*, json_agg(aps.service_id) AS service_ids
     FROM appointments a
     LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
     WHERE a.id = $1
     GROUP BY a.id`,
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

  const service = await query(
    `SELECT id, duration_minutes FROM services WHERE id = $1`,
    [serviceID],
  );

  if (service.rowCount === 0) {
    throw new Error('Service not found');
  }

  const durationMinutes = Number(service.rows[0].duration_minutes);

  const result = await query(
    `INSERT INTO appointments (client_id, barber_id, start_time, end_time)
     VALUES ($1::int, $2::int, $3::timestamptz, $3::timestamptz + ($4::int * interval '1 minute'))
     RETURNING *`,
    [clientId, barberId, start.toISOString(), durationMinutes],
  );

  const appointment = result.rows[0];

  if (!appointment) {
    throw new Error('Unable to create appointment');
  }

  const appointmentService = await query(
    `INSERT INTO appointment_services (appointment_id, service_id)
     VALUES ($1::int, $2::int)
     RETURNING *`,
    [appointment.id, serviceID],
  );

  return {
    ...appointment,
    service_id: serviceID,
    appointment_service: appointmentService.rows[0],
  };
}
