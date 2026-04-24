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
        console.log("Creating task_messages table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS task_messages (
                message_id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("Success!");
    } catch(e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

run();
