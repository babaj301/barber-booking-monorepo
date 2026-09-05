import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { query } from '../db';

describe('Availability & Exception Engine', () => {
  let barberToken: string;
  let barberUserId: number;
  let barberId: number;

  beforeEach(async () => {
    await query('DELETE FROM Exceptions CASCADE');
    await query('DELETE FROM Availability CASCADE');
    await query('DELETE FROM Appointments CASCADE');
    await query('DELETE FROM Barbers CASCADE');
    await query('DELETE FROM Users CASCADE');

    await query("SELECT setval('users_id_seq', 1, false)");
    await query("SELECT setval('barbers_id_seq', 1, false)");

    const userRes = await query(
      `INSERT INTO Users (name, email, password_hash, user_role)
       VALUES ('Master Barber', 'barber@test.com', 'hash', 'barber') RETURNING id`,
    );
    barberUserId = userRes.rows[0].id;

    const barberRes = await query(
      `INSERT INTO Barbers (user_id, bio, is_active) VALUES ($1, 'Bio', true) RETURNING id`,
      [barberUserId],
    );
    barberId = barberRes.rows[0].id;

    barberToken = jwt.sign(
      { userId: barberUserId, user_role: 'barber' },
      process.env.JWT_SECRET || 'your_jwt_secret',
    );

    // Monday (day_of_week = 1) from 09:00:00 to 17:00:00
    await query(
      `INSERT INTO Availability (barber_id, day_of_week, shift_hours)
       VALUES ($1, 1, timerange('09:00:00', '17:00:00', '[)'))`,
      [barberId],
    );
  });

  it('should return valid available slots on a normal working day', async () => {
    const res = await request(app).get(
      `/api/availability/slots?barber_id=${barberId}&date=2026-09-07&duration=30`,
    );

    expect(res.status).toBe(200);
    expect(res.body.slots.length).toBeGreaterThan(0);
    expect(res.body.slots[0].start_time).toContain('2026-09-07T09:00:00');
  });

  it('should return empty array when day off exception is applied', async () => {
    await request(app)
      .post('/api/availability/exceptions')
      .set('Authorization', `Bearer ${barberToken}`)
      .send({
        barber_id: barberId,
        exception_date: '2026-09-07',
        is_day_off: true,
        reason: 'Personal Holiday',
      });

    const res = await request(app).get(
      `/api/availability/slots?barber_id=${barberId}&date=2026-09-07&duration=30`,
    );

    expect(res.status).toBe(200);
    expect(res.body.slots).toEqual([]);
  });
});
