import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Barber Routes', () => {
  let temporaryToken: string;
  let temporaryUserId: number;
  let barberPayload: any;

  const testEmail = 'barber@testemail.com';

  async function cleanup() {
    await pool.query(`
      TRUNCATE TABLE barbers, users RESTART IDENTITY CASCADE;
    `);
  }

  beforeAll(async () => {
    await cleanup();

    const barberUser = {
      name: 'Barber Test User',
      email: testEmail,
      password: 'testingtesting',
      user_role: 'barber',
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(barberUser);

    temporaryUserId = registerResponse.body.user.id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: barberUser.email, password: barberUser.password });

    temporaryToken = loginResponse.body.token;

    barberPayload = {
      user_id: temporaryUserId,
      bio: 'Creating my barber for test',
      is_active: true,
    };
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('/api/barber', () => {
    it('should create a new barber tied to the test user', async () => {
      const barberCreationResponse = await request(app)
        .post('/api/barber')
        .set('Authorization', `Bearer ${temporaryToken}`)
        .send(barberPayload);

      expect(barberCreationResponse.status).toBe(201);
      expect(barberCreationResponse.body.barber.user_id).toBe(temporaryUserId);
    });
  });

  describe('/api/barber', () => {
    it('should get all barbers', async () => {
      const barbers = await request(app).get('/api/barber');

      expect(barbers.status).toBe(200);
      expect(barbers.body.barbers).toContainEqual(
        expect.objectContaining({
          user_id: temporaryUserId,
          name: 'Barber Test User',
          email: testEmail,
          bio: 'Creating my barber for test',
          is_active: true,
        }),
      );
    });
  });
});
