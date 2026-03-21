const pool = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running migrations...');

    // Read and execute schema file
    const schemaPath = path.join(__dirname, '001_initial_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schema);
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
