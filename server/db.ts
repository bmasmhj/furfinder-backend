import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err: Error) => {
  console.error('Unexpected database error:', err);
});

export default pool;
