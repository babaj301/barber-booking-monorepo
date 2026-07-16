import { query } from './db';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    const migrationPath = path.join(
      __dirname,
      '../migrations/001_create_users.sql',
    );

    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration: 001_create_users.sql');

    await query(sql);

    console.log('Query successful: Users table created');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
