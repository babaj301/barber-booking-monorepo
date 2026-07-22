import { query } from '../db';

export async function getBarbers() {
  const barbers = await query(`SELECT * FROM barbers`);
  console.log(barbers);
  if (barbers.rowCount === 0) {
    throw new Error('No barbers found');
  }
  return barbers.rows[0];
}

export async function getBarberById(id: number) {
  const barber = await query(`SELECT * FROM barbers WHERE id = $1`, [id]);

  if (barber.rowCount === 0) {
    throw new Error('Barber does not exist');
  }

  return barber.rows[0];
}

export async function editBarber(id: number, bio: string) {
  const result = await query(
    `UPDATE barbers SET bio = $2 WHERE id = $1 RETURNING *`,
    [id, bio],
  );
  return result.rows[0];
}

export async function createBarber(
  id: number,
  user_id: number,
  bio: string,
  is_active: boolean,
) {
  const result = await query(
    `INSERT INTO barbers(id, user_id, bio, is_active) VALUES($1, $2, $3, $4) RETURNING *`,
    [id, user_id, bio, is_active],
  );

  const newBarber = result.rows[0];

  return newBarber;
}

export async function deleteBarber(id: number) {
  const result = await query(
    `UPDATE barbers SET is_active = false WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
}

export async function reActivateBarber(id: number) {
  const result = await query(
    `UPDATE barbers SET is_active = true WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
}
