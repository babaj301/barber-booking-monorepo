import { query } from '../db';

export class SlotTakenError extends Error {
  code: string;
  status: number;

  constructor(message = 'Time slot already booked') {
    super(message);
    this.name = 'SlotTakenError';
    this.code = 'SLOT_TAKEN';
    this.status = 409;
  }
}

export interface CreateAppointmentInput {
  userId: number;
  barberId: number;
  startIso: string;
  endIso: string;
}

export async function createAppointmentService({
  userId,
  barberId,
  startIso,
  endIso,
}: CreateAppointmentInput) {
  const start = new Date(startIso);
  const end = new Date(endIso);

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    const error: any = new Error('Invalid appointment time range');
    error.statusCode = 400;
    throw error;
  }

  if (end <= start) {
    const error: any = new Error('endIso must be after startIso');
    error.statusCode = 400;
    throw error;
  }

  const overlapResult = await query(
    `SELECT 1
     FROM Appointments
     WHERE barber_id = $1
       AND status <> 'cancelled'
       AND appointment_time && tsrange($2::timestamptz, $3::timestamptz, '[)')
     LIMIT 1`,
    [barberId, start.toISOString(), end.toISOString()],
  );

  if (overlapResult.rowCount && overlapResult.rowCount > 0) {
    throw new SlotTakenError();
  }

  const result = await query(
    `INSERT INTO Appointments (user_id, barber_id, appointment_time, status)
     VALUES ($1, $2, tsrange($3, $4, '[)'), 'confirmed')
     RETURNING *`,
    [userId, barberId, start.toISOString(), end.toISOString()],
  );

  return result.rows[0];
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
