const { Pool } = require('pg');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const dbUrl = env.split('\n').find(l => l.startsWith('DATABASE_URL')).split('=')[1].trim();

const pool = new Pool({
  connectionString: dbUrl,
});

async function main() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'supports'
    `);
    console.log("supports table schema:", res.rows);

    const pkgRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'packages'
    `);
    console.log("packages table schema:", pkgRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

main();
