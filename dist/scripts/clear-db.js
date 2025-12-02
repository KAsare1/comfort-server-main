#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const data_source_1 = require("../database/data-source");
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
        await data_source_1.AppDataSource.initialize();
        console.log('Dropping database schema...');
        await data_source_1.AppDataSource.dropDatabase();
        console.log('Database schema dropped successfully.');
    }
    catch (err) {
        console.error('Failed to clear database:', err);
        process.exitCode = 2;
    }
    finally {
        try {
            await data_source_1.AppDataSource.destroy();
        }
        catch (err) {
        }
    }
}
main();
//# sourceMappingURL=clear-db.js.map