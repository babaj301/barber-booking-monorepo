import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Appointments Routes', () => {
  let temporaryToken: string;
  let temporaryUserId: number;
  let appointmentPayload: any;
  let barberPayload: any;

  // Clear out our test user before running tests so duplicate keys don't trip us up
  beforeAll(async () => {
    await pool.query('DELETE FROM Appointments WHERE id = 1');
    await pool.query("SELECT setval('users_id_seq', 1, false)");
    await pool.query("SELECT setval('appointments_id_seq', 1, false)");

    const testUser = {
      name: 'Test Engineer',
      email: 'test@example.com',
      password: 'Password123!',
      user_role: 'admin',
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const userId = registerResponse.body.user.id;

    // put user id into temporaryUserId for use in creating barber
    temporaryUserId = userId;

    const userLoginDetails = {
      email: testUser.email,
      password: testUser.password,
    };

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(userLoginDetails);

    temporaryToken = loginResponse.body.token;

    const barberCreationResponse = await request(app)
      .post(`/api/barber`)
      .set('Authorization', `Bearer ${temporaryToken}`)
      .send(barberPayload);

    appointmentPayload = {
      id: 1,
      client_id: 1,
      barber_id: 1,
      service_id: [1],
      start_time: '2026-08-27T10:00:00+01:00',
    };
  });

  describe('/api/appointments', () => {
    // Create new barber
    it('should create a new appointment', async () => {
      const appointmentCreationResponse = await request(app)
        .post(`/api/appointments`)
        .set('Authorization', `Bearer ${temporaryToken}`)
        .send(appointmentPayload);

      expect(appointmentCreationResponse.status).toBe(201);
    });
  });

  describe('/api/appointments', () => {
    // Get all appointments
    it('should get all appointments', async () => {
      const appointments = await request(app)
        .get(`/api/appointments`)
        .set('Authorization', `Bearer ${temporaryToken}`);
      expect(appointments.status).toBe(200);
      expect(appointments.body).toStrictEqual({
        appointments: {
          id: 1,
          client_id: 1,
          barber_id: 1,
          service_id: [1],
          start_time: '2026-08-27T10:00:00+01:00',
        },
      });
      expect(appointments.body.appointments.client_id).toBe(temporaryUserId);
    });
  });
});

afterAll(async () => {
  await pool.query("DELETE FROM Users WHERE email = 'test@example.com'");
  await pool.query("SELECT setval('users_id_seq', 1, false)");
});
