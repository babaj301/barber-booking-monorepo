import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Auth Routes', () => {
  const testEmail = 'test@example.com';

  async function cleanup() {
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
  }

  beforeAll(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user and return user metadata without the password hash', async () => {
      const testPayload = {
        name: 'Test Engineer',
        email: testEmail,
        password: 'Password123!',
        user_role: 'admin',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(testPayload);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.email).toBe(testPayload.email);
      expect(response.body.user.password_hash).toBeUndefined();
      expect(response.body.user.user_role).toBe('admin');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'Password123!' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
    });
  });
});