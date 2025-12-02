#!/usr/bin/env ts-node
import { config } from 'dotenv';
config();

import { AppDataSource } from '../database/data-source';

/**
 * Destructive script to clear/drop the database schema.
 * Usage:
 *  - `npm run clear-db -- --yes`  (recommended)
 *  - `CLEAR_DB=true npm run clear-db`
 *
 * The script requires explicit confirmation via --yes flag or CLEAR_DB=true env var.
 */
async function main() {
  const confirmed = process.argv.includes('--yes') || process.env.CLEAR_DB === 'true';

  console.log('⚠️  WARNING: This will drop the database schema and all data.');

  if (!confirmed) {
    console.log('Refusing to run without confirmation.');
    console.log('Provide `--yes` or set `CLEAR_DB=true` to proceed.');
    process.exit(1);
  }

  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();

    console.log('Dropping database schema...');
    // dropDatabase will drop the schema (public) and recreate it in TypeORM
    // This is destructive and will remove all data.
    // Note: For some Postgres setups this requires sufficient privileges.
    await AppDataSource.dropDatabase();

    console.log('Database schema dropped successfully.');
  } catch (err) {
    console.error('Failed to clear database:', err);
    process.exitCode = 2;
  } finally {
    try {
      await AppDataSource.destroy();
    } catch (err) {
      // ignore
    }
  }
}

main();
