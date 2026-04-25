import pg from 'pg';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
    if(line.includes('=')) {
        const [key, ...rest] = line.split('=');
        envVars[key.trim()] = rest.join('=').trim();
    }
});

const { Pool } = pg;
const pool = new Pool({
  host: envVars.PG_HOST,
  port: envVars.PG_PORT,
  database: envVars.PG_DB,
  user: envVars.PG_USER,
  password: envVars.PG_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const res = await pool.query("SELECT * FROM coupons;");
        console.log("Coupons in DB:", res.rows);
    } catch(e) {
        console.error(e);
    }
    process.exit(0);
}
run();
