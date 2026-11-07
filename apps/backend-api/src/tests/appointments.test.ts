import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';
import {
  registerAndLoginUser,
  buildAuthHeader,
} from './helpers/authTestHelper';

describe('Appointments route tests', () => {
  let clientToken: string;
  let clientId: number;
  let adminToken: string;
  let barberId: number;
  let serviceId: number;

  beforeAll(async () => {
    await pool.query(
      "DELETE FROM appointment_services WHERE service_id IN (SELECT id FROM services WHERE name = 'Appointment Service')",
    );
    await pool.query(
      "DELETE FROM appointments WHERE barber_id IN (SELECT id FROM barbers WHERE name = 'Appointment Barber')",
    );
    await pool.query("DELETE FROM barbers WHERE name = 'Appointment Barber'");
    await pool.query("DELETE FROM services WHERE name = 'Appointment Service'");
    await pool.query(
      "DELETE FROM users WHERE email IN ('appt-client@testemail.com', 'appt-admin@testemail.com', 'appt-barber@testemail.com')",
    );
    await pool.query("SELECT setval('users_id_seq', 1, false)");
    await pool.query("SELECT setval('barbers_id_seq', 1, false)");
    await pool.query("SELECT setval('services_id_seq', 1, false)");
    await pool.query("SELECT setval('appointments_id_seq', 1, false)");

    const clientUser = {
      name: 'Appointment Client',
      email: 'appt-client@testemail.com',
      password: 'testingtesting',
      user_role: 'client',
    };

    const adminUser = {
      name: 'Appointment Admin',
      email: 'appt-admin@testemail.com',
      password: 'testingtesting',
      user_role: 'admin',
    };

    const barberUser = {
      name: 'Appointment Barber',
      email: 'appt-barber@testemail.com',
      password: 'testingtesting',
      user_role: 'barber',
    };

    const authenticatedClient = await registerAndLoginUser(clientUser);
    const authenticatedAdmin = await registerAndLoginUser(adminUser);
    const authenticatedBarber = await registerAndLoginUser(barberUser);

    clientId = authenticatedClient.user.id;
    clientToken = authenticatedClient.token;
    adminToken = authenticatedAdmin.token;

    const barberInsert = await pool.query(
      `INSERT INTO barbers (user_id, name, bio, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [authenticatedBarber.user.id, 'Appointment Barber', 'Test barber', true],
    );
    barberId = barberInsert.rows[0].id;

    const serviceInsert = await pool.query(
      `INSERT INTO services (name, price, duration_minutes, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ['Appointment Service', 75, 30, true],
    );
    serviceId = serviceInsert.rows[0].id;
  });

  it('should create an appointment for a client', async () => {
    const futureStart = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const response = await request(app)
      .post('/api/appointments')
      .set(buildAuthHeader(clientToken))
      .send({
        client_id: clientId,
        barber_id: barberId,
        service_id: serviceId,
        start_time: futureStart,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Appointment created successfully');
    expect(response.body.appointment.client_id).toBe(clientId);
    expect(response.body.appointment.barber_id).toBe(barberId);
    expect(response.body.appointment.service_id).toBe(serviceId);
  });

  it('should fetch all appointments', async () => {
    const response = await request(app).get('/api/appointments');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.appointments)).toBe(true);
    expect(response.body.appointments.length).toBeGreaterThan(0);
  });

  it('should reject a past start time', async () => {
    const pastStart = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const response = await request(app)
      .post('/api/appointments')
      .set(buildAuthHeader(clientToken))
      .send({
        client_id: clientId,
        barber_id: barberId,
        service_id: serviceId,
        start_time: pastStart,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Start time must be in the future');
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM appointment_services WHERE service_id IN (SELECT id FROM services WHERE name = 'Appointment Service')",
    );
    await pool.query(
      "DELETE FROM appointments WHERE barber_id IN (SELECT id FROM barbers WHERE name = 'Appointment Barber')",
    );
    await pool.query("DELETE FROM barbers WHERE name = 'Appointment Barber'");
    await pool.query("DELETE FROM services WHERE name = 'Appointment Service'");
    await pool.query(
      "DELETE FROM users WHERE email IN ('appt-client@testemail.com', 'appt-admin@testemail.com', 'appt-barber@testemail.com')",
    );
  });
});
