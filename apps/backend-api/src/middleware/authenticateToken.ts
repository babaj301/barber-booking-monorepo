import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';

export async function registerToken(
  name: string,
  email: string,
  password: string,
  user_role: string,
  rounds: number,
) {
  const hashedPassword = await bcrypt.hash(password, rounds);

  const result = await query(
    `INSERT INTO Users(name, email, password_hash, user_role) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, user_role],
  );

  const newUser = result.rows[0];
  delete newUser.password_hash;

  return newUser;
}
