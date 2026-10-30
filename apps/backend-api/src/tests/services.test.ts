import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';
import {
  buildAuthHeader,
  registerAndLoginUser,
} from './helpers/authTestHelper';

describe('Services route tests', () => {
  let temporaryToken: string;
  let temporaryUserId: number;
  let servicesPayload: any;

  beforeAll(async () => {
    await pool.query('DELETE FROM services WHERE id = 1');
    await pool.query('DELETE FROM Users WHERE id= 3');
    await pool.query(
      "DELETE FROM users WHERE email = 'services@testemail.com'",
    );
    await pool.query("SELECT setval('services_id_seq', 1, false)");
    await pool.query("SELECT setval('users_id_seq', 1, false)");

    const servicesTestUser = {
      name: 'Services Test Admin',
      email: 'services@testemail.com',
      password: 'testingtesting',
      user_role: 'admin',
    };

    const authenticatedUser = await registerAndLoginUser(servicesTestUser);

    temporaryUserId = authenticatedUser.user.id;
    temporaryToken = authenticatedUser.token;

    servicesPayload = {
      id: 1,
      name: 'Low Top Fade',
      price: 200,
      duration_minutes: 20,
      is_active: true,
    };
  });

  it('should create a service as an admin user', async () => {
    const response = await request(app)
      .post('/api/services')
      .set(buildAuthHeader(temporaryToken))
      .send(servicesPayload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Service created succesfully');
    expect(response.body.service.name).toBe(servicesPayload.name);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM services WHERE id = 1');
    await pool.query(
      "DELETE FROM users WHERE email = 'services@testemail.com'",
    );
  });
});
