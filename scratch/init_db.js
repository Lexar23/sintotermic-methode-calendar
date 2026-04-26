const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Basic env parser
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
if (!dbUrlMatch) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const dbUrl = dbUrlMatch[1].trim();

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function initDb() {
  try {
    console.log('Reading schema...');
    const schemaFile = path.join(__dirname, '../src/lib/db/schema.sql');
    const schema = fs.readFileSync(schemaFile, 'utf8');
    
    console.log('Creating tables...');
    await pool.query(schema);
    console.log('✅ Tables created successfully!');

  } catch (err) {
    console.error('❌ DB Init failed:', err.message);
  } finally {
    await pool.end();
  }
}

initDb();
