const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Force it to use the Railway URL if it exists
const pool = new Pool(
  process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {}
);

async function runMigrations() {
  try {
    console.log('Connecting to cloud database...');
    const schema = fs.readFileSync(path.join(__dirname, '001_initial_schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
