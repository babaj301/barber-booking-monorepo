import { query } from '../db';

interface AppointmentService {
  client_id: number;
  barber_id: number;
  service_id: number[];
  start_time: string;
}

export async function createAppointmentService({
  client_id,
  barber_id,
  service_id,
  start_time,
}: AppointmentService) {
  try {
    await query('BEGIN');

    const servicesResult = await query(
      `SELECT id, duration_minutes FROM services WHERE id = ANY($1) AND is_active = true`,
      [service_id],
    );

    if (servicesResult.rows.length !== service_id.length) {
      throw new Error(`INVALID_SERVICES`);
    }

    const totalDurationMinutes = servicesResult.rows.reduce(
      (sum, s) => sum + s.duration_minutes,
      0,
    );

    const start = new Date(start_time);
    const end = new Date(start.getTime() + totalDurationMinutes * 60000);

    const appointmentResult = await query(
      `INSERT INTO Appointments(client_id, barber_id, start_time, end_time, current_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [client_id, barber_id, start.toISOString(), end.toISOString(), 'pending'],
    );

    const appointment = appointmentResult.rows[0];

    // Batch insert into Appointment_services junction table
    const serviceInsertQueries = service_id.map((serviceId) =>
      query(
        `INSERT INTO Appointment_services (appointment_id, service_id)
         VALUES ($1, $2)`,
        [appointment.id, serviceId],
      ),
    );

    await Promise.all(serviceInsertQueries);

    await query('COMMIT');

    return appointment;
  } catch (error: any) {
    await query('ROLLBACK');
    // PostgreSQL Exclusion Constraint Code for overlapping slots
    if (error.code === '23P01') {
      const conflictError = new Error('SLOT_UNAVAILABLE');
      (conflictError as any).statusCode = 409;
      throw conflictError;
    }

    throw error;
  }
}

export async function getAppointmentById(id: number) {
  const result = await query(`SELECT * FROM Appointments WHERE id = $1`, [id]);
  return result.rows[0];
}

export async function getAppointments() {
  const result = await query(`SELECT * FROM Appointments`);
  return result.rows;
}

export async function updateAppointmentStatus(id: number, status: string) {
  const result = await query(
    `UPDATE Appointments SET current_status = $2 WHERE id = $1 RETURNING *`,
    [id, status],
  );
  return result.rows[0];
}

export async function deleteAppointment(id: number) {
  const result = await query(
    `UPDATE Appointments SET is_active = false WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
}
