import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Barber Routes', () => {
  // Clear out our test user before running tests so duplicate keys don't trip us up
  beforeAll(async () => {
    await pool.query("DELETE FROM Users WHERE email = 'test@example.com'");
  });

  describe('GET /api/barber', () => {
    it('should return a list of barbers', async () => {
      const response = await request(app).get('/api/barber');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  
});
