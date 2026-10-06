import { query } from '../db';

export interface CreateExceptionInput {
  barber_id: number;
  exception_date: string; // YYYY-MM-DD
  is_day_off: boolean;
  start_time?: string; // HH:MM:SS
  end_time?: string; // HH:MM:SS
  reason?: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

/**
 * Creates or updates a schedule exception for a barber (UPSERT).
 */
export async function createBarberExceptionService(
  input: CreateExceptionInput,
) {
  const {
    barber_id,
    exception_date,
    is_day_off,
    start_time,
    end_time,
    reason,
  } = input;

  let shiftHoursParam: string | null = null;
  if (!is_day_off) {
    if (!start_time || !end_time) {
      throw new Error(
        'Custom working shifts require both start_time and end_time',
      );
    }
    shiftHoursParam = `[${start_time}, ${end_time})`;
  }

  const result = await query(
    `INSERT INTO Exceptions (barber_id, exception_date, is_day_off, shift_hours, reason)
     VALUES ($1, $2, $3, $4::timerange, $5)
     ON CONFLICT (barber_id, exception_date) 
     DO UPDATE SET 
        is_day_off = EXCLUDED.is_day_off,
        shift_hours = EXCLUDED.shift_hours,
        reason = EXCLUDED.reason
     RETURNING exceptions_id, barber_id, exception_date, is_day_off, reason`,
    [barber_id, exception_date, is_day_off, shiftHoursParam, reason || null],
  );

  return result.rows[0];
}

/**
 * Deletes a schedule exception by ID for a specific barber.
 */
export async function deleteBarberExceptionService(
  exceptionId: number,
  barberId: number,
) {
  const result = await query(
    `DELETE FROM Exceptions 
     WHERE exceptions_id = $1 AND barber_id = $2 
     RETURNING exceptions_id`,
    [exceptionId, barberId],
  );

  if (result.rowCount === 0) {
    throw new Error('Exception not found or unauthorized');
  }

  return result.rows[0];
}

/**
 * Get active working shift boundaries (start_time and end_time) for a given date.
 */
export async function getBarberShiftForDate(
  barberId: number,
  dateStr: string,
): Promise<{ start_time: string; end_time: string } | null> {
  const targetDate = new Date(dateStr);
  const dayOfWeek = targetDate.getUTCDay();

  // 1. Check for specific date exceptions
  const exceptionResult = await query(
    `SELECT is_day_off, 
            lower(shift_hours)::text AS start_time, 
            upper(shift_hours)::text AS end_time 
     FROM Exceptions 
     WHERE barber_id = $1 AND exception_date = $2`,
    [barberId, dateStr],
  );

  if (exceptionResult.rows.length > 0) {
    const exception = exceptionResult.rows[0];
    if (exception.is_day_off) {
      return null; // Day off
    }
    return { start_time: exception.start_time, end_time: exception.end_time };
  }

  // 2. Fall back to recurring weekly schedule
  const availabilityResult = await query(
    `SELECT lower(shift_hours)::text AS start_time, 
            upper(shift_hours)::text AS end_time 
     FROM Availability 
     WHERE barber_id = $1 AND day_of_week = $2`,
    [barberId, dayOfWeek],
  );

  if (availabilityResult.rows.length === 0) {
    return null; // Not working on this day of week
  }

  return {
    start_time: availabilityResult.rows[0].start_time,
    end_time: availabilityResult.rows[0].end_time,
  };
}

/**
 * CORE ENGINE: Computes open time slots for a barber on a specific date.
 */
export async function getAvailableTimeSlotsService(
  barberId: number,
  dateStr: string,
  durationMinutes: number,
): Promise<TimeSlot[]> {
  const shift = await getBarberShiftForDate(barberId, dateStr);
  if (!shift) {
    return [];
  }

  // Fetch non-cancelled appointments for this barber on this date
  const appointmentsResult = await query(
    `SELECT lower(appointment_time)::timestamptz AS start_time,
            upper(appointment_time)::timestamptz AS end_time
     FROM Appointments
     WHERE barber_id = $1
       AND status <> 'cancelled'
       AND lower(appointment_time)::date = $2::date`,
    [barberId, dateStr],
  );

  const bookedIntervals = appointmentsResult.rows.map((app) => ({
    start: new Date(app.start_time).getTime(),
    end: new Date(app.end_time).getTime(),
  }));

  const shiftStart = new Date(`${dateStr}T${shift.start_time}Z`).getTime();
  const shiftEnd = new Date(`${dateStr}T${shift.end_time}Z`).getTime();
  const slotStepMs = 30 * 60 * 1000; // 30-minute steps
  const durationMs = durationMinutes * 60 * 1000;

  const slots: TimeSlot[] = [];

  for (
    let windowStart = shiftStart;
    windowStart + durationMs <= shiftEnd;
    windowStart += slotStepMs
  ) {
    const windowEnd = windowStart + durationMs;

    // Check overlap against existing bookings
    const isConflicting = bookedIntervals.some(
      (booked) => windowStart < booked.end && windowEnd > booked.start,
    );

    if (!isConflicting) {
      slots.push({
        start_time: new Date(windowStart).toISOString(),
        end_time: new Date(windowEnd).toISOString(),
        available: true,
      });
    }
  }

  return slots;
}
