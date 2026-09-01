import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Appointments Routes', () => {
  let temporaryToken: string;
  let temporaryUserId: number;
  let barberId: number;
  let serviceId: number;
  let appointmentPayload: any;

  const testEmail = 'test@example.com';
  const serviceName = 'Skin Cut';

  async function cleanup() {
    await pool.query(`
      DELETE FROM appointment_services
      WHERE appointment_id IN (
        SELECT a.id FROM appointments a
        JOIN users u ON u.id = a.client_id
        WHERE u.email = $1
      )
    `, [testEmail]);

    await pool.query(`
      DELETE FROM appointments
      WHERE client_id = (SELECT id FROM users WHERE email = $1)
    `, [testEmail]);

    await pool.query(`
      DELETE FROM barbers
      WHERE user_id = (SELECT id FROM users WHERE email = $1)
    `, [testEmail]);

    await pool.query(`DELETE FROM services WHERE name = $1`, [serviceName]);
    await pool.query(`DELETE FROM users WHERE email = $1`, [testEmail]);
  }

  beforeAll(async () => {
    await cleanup();

    const testUser = {
      name: 'Test Engineer',
      email: testEmail,
      password: 'Password123!',
      user_role: 'admin',
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    temporaryUserId = registerResponse.body.user.id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    temporaryToken = loginResponse.body.token;

    const barberPayloadForCreation = {
      user_id: temporaryUserId,
      bio: 'Creating my barber for appointment test',
      is_active: true,
    };

    const barberCreationResponse = await request(app)
      .post('/api/barber')
      .set('Authorization', `Bearer ${temporaryToken}`)
      .send(barberPayloadForCreation);

    barberId = barberCreationResponse.body.barber.id;

    const servicePayload = {
      name: serviceName,
      price: 1000,
      duration_minutes: 30,
      is_active: true,
    };

    const serviceCreationResponse = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${temporaryToken}`)
      .send(servicePayload);

    serviceId = serviceCreationResponse.body.service.id;

    appointmentPayload = {
      client_id: temporaryUserId,
      barber_id: barberId,
      service_id: [serviceId],
      start_time: '2026-08-27T10:00:00+01:00',
    };
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('/api/appointments', () => {
    it('should create a new appointment', async () => {
      const appointmentCreationResponse = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${temporaryToken}`)
        .send(appointmentPayload);

      expect(appointmentCreationResponse.status).toBe(201);
      expect(appointmentCreationResponse.body.appointment.client_id).toBe(temporaryUserId);
    });
  });

  describe('/api/appointments', () => {
    it('should get all appointments', async () => {
      const appointments = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${temporaryToken}`);

      expect(appointments.status).toBe(200);
      expect(appointments.body.appointments).toHaveLength(1);
      expect(appointments.body.appointments[0].client_id).toBe(temporaryUserId);
    });
  });
});