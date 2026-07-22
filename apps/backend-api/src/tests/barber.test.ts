import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Barber Routes', () => {
  const testEmail = 'barber-test@example.com';
  const testPassword = 'Password123!';
  const testBarberId = 9999;

  beforeAll(async () => {
    await pool.query(`DELETE FROM barbers WHERE id = $1`, [testBarberId]);
    await pool.query(`DELETE FROM Users WHERE email = $1`, [testEmail]);
  });

  afterAll(async () => {
    await pool.query(`DELETE FROM barbers WHERE id = $1`, [testBarberId]);
    await pool.query(`DELETE FROM Users WHERE email = $1`, [testEmail]);
  });

  describe('POST /api/barber', () => {
    it('should create a new barber with a valid admin token', async () => {
      const registerPayload = {
        name: 'Test Engineer',
        email: testEmail,
        password: testPassword,
        user_role: 'admin',
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(registerPayload);

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.user.email).toBe(testEmail);

      const loginPayload = {
        email: testEmail,
        password: testPassword,
      };

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginPayload);

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();

      const userId = registerResponse.body.user.id;
      const barberPayload = {
        id: testBarberId,
        user_id: userId,
        bio: 'Test barber here',
        is_active: true,
      };

      const response = await request(app)
        .post('/api/barber')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(barberPayload);

      expect(response.status).toBe(201);
      expect(response.body.barber).toBeDefined();
      expect(response.body.barber.user_id).toBe(userId);
      expect(response.body.barber.is_active).toBe(true);
    });
  });

  describe('GET /api/barber', () => {
    it('should return a list of barbers', async () => {
      const response = await request(app).get('/api/barber');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/barber/:id', () => {
    it('should return a single barber', async () => {
      const response = await request(app).get('/api/barber/1');
      expect(response.status).toBe(200);
    });
  });
});
