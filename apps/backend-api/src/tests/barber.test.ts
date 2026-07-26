import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';
import { query } from '../db';

describe('Barber Routes', () => {
  // Clear out our test user before running tests so duplicate keys don't trip us up
  beforeAll(async () => {
    await pool.query('DELETE FROM barbers WHERE id = 1');
    // Had to run the barber deleting query first to avoid fkey constraints
    await pool.query('DELETE FROM Users WHERE id = 2');
    await pool.query("SELECT setval('users_id_seq', 1, false)");
    await pool.query("SELECT setval('barbers_id_seq', 1, false)");
  });

  describe('/api/barber', () => {
      // Create new barber

    it('should create a new user and barber to populate the database', async () => {
      // Create a new user to tie the barber to

      const barberUser = {
        name: 'Barber Test User',
        email: 'barber@testemail.com',
        password: 'testingtesting',
        user_role: 'barber',
      };

      const registerResponse = await request(app)
        .post(`/api/auth/register`)
        .send(barberUser);

      console.log(registerResponse.body);

      // Get the id from the response of fetching the user

      const userId = registerResponse.body.user.id;

      const userLoginDetails = {
        email: barberUser.email,
        password: barberUser.password,
      };

      // Login as the user to get token
      const loginResponse = await request(app)
        .post(`/api/auth/login`)
        .send(userLoginDetails);

      console.log(loginResponse.body);

      // Get the token from the login response
      const token = loginResponse.body.token;

      // Create the barber
      const barberPayload = {
        id: 1,
        user_id: userId,
        bio: 'Creating my barber for test',
        is_active: true,
      };

      const barberCreationResponse = await request(app)
        .post(`/api/barber`)
        .set('Authorization', `Bearer ${token}`)
        .send(barberPayload);

      console.log(barberCreationResponse.body);
    });

    it("should fetch the barbers", async () => {
      const response = await request(app).get(`/api/barber`);
      expect(response.status).toBe(200);
      expect(response.body.barbers.length).toBeGreaterThan(0);

      const firstBarber = response.body.barbers[0];
      expect(firstBarber.id).toBe(1);
      expect(firstBarber.user_id).toBe(2);
      expect(firstBarber.bio).toBe('Creating my barber for test');
      expect(firstBarber.is_active).toBe(true);
    })
  });
});

