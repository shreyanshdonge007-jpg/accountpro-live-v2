const { Pool } = require('pg');
require('dotenv').config();

// Force the app to use the Railway URL if it exists
const pool = new Pool(
  process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {} // Fallback for local development
);

module.exports = pool;
