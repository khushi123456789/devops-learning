const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connection pool — reads settings from environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Create the table on startup if it doesn't exist
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Database ready');
}

// GET all items
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM items ORDER BY id DESC');
  res.json({
    message: 'DevOps app running',
    total_items: result.rows.length,
    items: result.rows,
  });
});

// POST a new item
app.post('/items', async (req, res) => {
  const result = await pool.query(
    'INSERT INTO items (text) VALUES ($1) RETURNING *',
    [req.body.text]
  );
  res.json({ success: true, item: result.rows[0] });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', port: PORT });
});

// Start server only after DB is ready, retrying if DB isn't up yet
async function start() {
  let connected = false;
  while (!connected) {
    try {
      await initDb();
      connected = true;
    } catch (err) {
      console.log('Waiting for database...', err.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  app.listen(PORT, () => console.log(`App running on port ${PORT}`));
}

start();