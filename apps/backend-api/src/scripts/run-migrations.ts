import { query } from '../db';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    const targetPath = path.join(__dirname, '../../migrations');
    const files = fs.readdirSync(targetPath);
    const sortedFiles = files.sort();

    for (const file of sortedFiles) {
      const fullpath = path.join(targetPath, file);
      const content = fs.readFileSync(fullpath, 'utf8');

      console.log(content);

      await query(content);
    }
    // console.log('Running migration: 001_create_users.sql');

    console.log('All migrations executed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
