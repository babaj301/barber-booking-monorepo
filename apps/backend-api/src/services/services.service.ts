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
    const services = await query(`SELECT * FROM services WHERE`);

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

export async function createService( name: string, price: number, durationMinutes: number, is_active: boolean) {
  const result = await query(
    `INSERT INTO services( name, price, duration_minutes, is_active) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [ name, price, durationMinutes, is_active],
  );
  return result.rows[0];
}