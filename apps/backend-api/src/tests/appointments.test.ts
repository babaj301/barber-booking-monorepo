import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../app';
import pool from '../db';

describe('Appointments API', () => {
  const email = 'booking@example.com';
  const password = 'Password123!';

  let token: string;
  let userId: number;
  let barberId: number;

  beforeEach(async () => {
    await pool.query(`
      DELETE FROM Appointments;
      DELETE FROM Exceptions;
      DELETE FROM Availability;
      DELETE FROM Barbers;
      DELETE FROM Users;
    `);

    const userResult = await pool.query(
      `INSERT INTO Users (name, email, password_hash, user_role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Booking User', email, await bcrypt.hash(password, 10), 'admin'],
    );

    userId = userResult.rows[0].id;

    const barberResult = await pool.query(
      `INSERT INTO Barbers (user_id, bio, is_active)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, 'Test barber', true],
    );

    barberId = barberResult.rows[0].id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    token = loginResponse.body.token;
  });

  it('should successfully create a new booking', async () => {
    const payload = {
      barberId,
      startIso: '2026-10-01T10:00:00.000Z',
      endIso: '2026-10-01T11:00:00.000Z',
    };

    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toBeTruthy();
    expect(response.body.id).toBeDefined();
    expect(response.body.barber_id ?? response.body.barberId).toBe(barberId);
    expect(response.body.user_id ?? response.body.userId ?? userId).toBe(
      userId,
    );
  });

  it('should reject double booking for the same barber at same time', async () => {
    const payload = {
      barberId,
      startIso: '2026-10-01T10:00:00.000Z',
      endIso: '2026-10-01T11:00:00.000Z',
    };

    const firstResponse = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toEqual({ error: 'Time slot already booked' });
  });
});
