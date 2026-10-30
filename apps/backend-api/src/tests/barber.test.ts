import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';
import {
  registerAndLoginUser,
  buildAuthHeader,
} from './helpers/authTestHelper';

describe('Barber Routes', () => {
  let temporaryToken: string;
  let temporaryUserId: number;
  let barberPayload: any;

  beforeAll(async () => {
    await pool.query("DELETE FROM barbers WHERE name = 'testBarber'");
    await pool.query("DELETE FROM users WHERE email = 'barber@testemail.com'");
    await pool.query("SELECT setval('users_id_seq', 1, false)");
    await pool.query("SELECT setval('barbers_id_seq', 1, false)");

    const barberUser = {
      name: 'Barber Test User',
      email: 'barber@testemail.com',
      password: 'testingtesting',
      user_role: 'barber',
    };

    const authenticatedUser = await registerAndLoginUser(barberUser);

    temporaryUserId = authenticatedUser.user.id;
    temporaryToken = authenticatedUser.token;

    barberPayload = {
      id: 1,
      user_id: temporaryUserId,
      name: 'testBarber',
      bio: 'Creating my barber for test',
      is_active: true,
    };
  });

  describe('/api/barber', () => {
    it('should create a new user and barber to populate the database', async () => {
      const barberCreationResponse = await request(app)
        .post('/api/barber')
        .set(buildAuthHeader(temporaryToken))
        .send(barberPayload);

      expect(barberCreationResponse.status).toBe(201);
    });
  });

  describe('/api/barber', () => {
    it('should get all barbers', async () => {
      const barbers = await request(app).get('/api/barber');
      expect(barbers.status).toBe(200);
      expect(barbers.body).toStrictEqual({
        barbers: {
          id: 1,
          user_id: temporaryUserId,
          name: 'Barber Test User',
          email: 'barber@testemail.com',
          bio: 'Creating my barber for test',
          is_active: true,
        },
      });
      expect(barbers.body.barbers.user_id).toBe(temporaryUserId);
    });
  });

  afterAll(async () => {
    await pool.query("DELETE FROM barbers WHERE name = 'testBarber'");
    await pool.query("DELETE FROM users WHERE email = 'barber@testemail.com'");
  });
});
