import { query } from '../db';
import { getBarberShiftForDate } from './availability.service';

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

    // 1. Validate Services
    const servicesResult = await query(
      `SELECT id, duration_minutes FROM Services WHERE id = ANY($1) AND is_active = true`,
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
    const dateStr = start.toISOString().split('T')[0];

    // 2. Validate against Barber Working Shift / Exceptions
    const shift = await getBarberShiftForDate(barber_id, dateStr);
    if (!shift) {
      throw new Error('BARBER_NOT_WORKING_ON_DATE');
    }

    const shiftStart = new Date(`${dateStr}T${shift.start_time}Z`);
    const shiftEnd = new Date(`${dateStr}T${shift.end_time}Z`);

    if (start < shiftStart || end > shiftEnd) {
      throw new Error('APPOINTMENT_OUTSIDE_WORKING_HOURS');
    }

    // 3. Create Appointment
    const appointmentResult = await query(
      `INSERT INTO Appointments(client_id, barber_id, start_time, end_time, current_status) 
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [client_id, barber_id, start.toISOString(), end.toISOString(), 'pending'],
    );

    const appointment = appointmentResult.rows[0];

    // 4. Multi-row Insert into Appointment_services
    const values = service_id.map((_, i) => `($1, $${i + 2})`).join(', ');
    await query(
      `INSERT INTO Appointment_services (appointment_id, service_id) VALUES ${values}`,
      [appointment.id, ...service_id],
    );

    await query('COMMIT');
    return appointment;
  } catch (error: any) {
    await query('ROLLBACK');

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
