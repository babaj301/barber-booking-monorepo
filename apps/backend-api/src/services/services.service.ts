import { query } from '../db';

export async function getServices(search?: string) {
  if (search) {
    const services = await query(`SELECT * FROM services WHERE name ILIKE $1`, [
      `%${search}%`,
    ]);
    if (services.rowCount === 0) {
      throw new Error('No services found');
    }
    return services.rows[0];
  } else {
    const services = await query(`SELECT * FROM services`);

    if (services.rowCount === 0) {
      throw new Error('No services found');
    }
    return services.rows[0];
  }
}

export async function getServiceById(id: number) {
  const service = await query(`SELECT * FROM services WHERE id = $1`, [id]);
  if (service.rowCount === 0) {
    throw new Error('Service does not exist');
  }
  return service.rows[0];
}

export async function createService(
  id: number,
  name: string,
  price: number,
  duration_minutes: number,
  is_active: boolean,
) {
  const result = await query(
    `INSERT INTO services( id, name, price, duration_minutes, is_active) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [id, name, price, duration_minutes, is_active],
  );
  return result.rows[0];
}

export async function editService(
  id: number,
  name: string,
  price: number,
  duration_minutes: number,
  is_active: boolean,
) {
  const result = await query(
    `UPDATE services SET name = $2, price = $3, duration_minutes = $4, is_active = $5 WHERE id = $1 RETURNING *`,
    [id, name, price, duration_minutes, is_active],
  );
  return result.rows[0];
}

export async function deleteService(id: number) {
  const result = await query(
    `UPDATE services SET is_active = false WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
}

export async function reactivateService(id: number) {
  const result = await query(
    `UPDATE services SET is_active = true WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
}
