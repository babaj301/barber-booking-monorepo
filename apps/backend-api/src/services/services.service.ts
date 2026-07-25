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

