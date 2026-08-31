import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Auth Routes', () => {
  // Clear out our test user before running tests so duplicate keys don't trip us up
  beforeAll(async () => {
    await pool.query("DELETE FROM Users WHERE email = 'test@example.com'");
    await pool.query("SELECT setval('users_id_seq', 1, false)");
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user and return user metadata without the password hash', async () => {
      const testPayload = {
        name: 'Test Engineer',
        email: 'test@example.com',
        password: 'Password123!',
        user_role: 'admin',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(testPayload);

      // Core assertions
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');

      expect(response.body.user.email).toBe(testPayload.email);
      expect(response.body.user.password_hash).toBeUndefined();
      expect(response.body.user.user_role).toBe('admin');
    });
  });
  describe('POST /api/auth/login', () => {
    it('should successfully register a new user and return user metadata', async () => {
      const testPayload = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(testPayload);

      // assertions
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
    });
  });

  afterAll(async () => {
    await pool.query("DELETE FROM Users WHERE email = 'test@example.com'");
    await pool.query("SELECT setval('users_id_seq', 1, false)");
  });
});
