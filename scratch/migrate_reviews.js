const { Client } = require('pg');

async function migrate() {
    const client = new Client({
        connectionString: 'postgresql://postgres.hhedhfauqdrkjmbwncst:tanvir483469@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres'
    });
    try {
        await client.connect();
        console.log('Connected to database');
        await client.query(`
            ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply TEXT;
            ALTER TABLE reviews ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP;
        `);
        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await client.end();
    }
}

migrate();
