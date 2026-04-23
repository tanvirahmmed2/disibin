const { Client } = require('pg');

async function check() {
    const client = new Client({
        connectionString: 'postgresql://postgres.hhedhfauqdrkjmbwncst:tanvir483469@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres'
    });
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'reviews'
        `);
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

check();
