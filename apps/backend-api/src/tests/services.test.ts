import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import pool from '../db';
import { query } from '../db';

describe('Services route tests', () => {
  // clear out test services

  let temporaryToken: string;
  let temporaryUserId: number;
  let barberPayload: any;

  beforeAll(async () => {
    await pool.query('DELETE FROM services WHERE id = 1');
    await pool.query('DELETE FROM Users WHERE id= 3');
    await pool.query("DELETE FROM users WHERE email = 'services@testemail.com'");
    await pool.query("SELECT setval('services_id_seq', 1, false)");
    await pool.query("SELECT setval('users_id_seq', 1, false)");
  });
 
  // Create Test Admin User

  const servicesTestUser = {
    name: 'Services Test User',
  }
});
