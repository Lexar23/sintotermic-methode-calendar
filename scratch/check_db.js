const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Xl28naSYsMoB@ep-lingering-frost-an10wig3-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function checkDb() {
  try {
    console.log('Checking tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name));

    if (tables.rows.some(r => r.table_name === 'users')) {
      const users = await pool.query('SELECT count(*) FROM users');
      console.log('User count:', users.rows[0].count);
    } else {
      console.log('❌ Table "users" does not exist!');
    }
  } catch (err) {
    console.error('❌ DB Check failed:', err.message);
  } finally {
    await pool.end();
  }
}

checkDb();
