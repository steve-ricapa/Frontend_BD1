import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'proyecto_bd',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || 5432,
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// Generic query endpoint (WARNING: For development only, vulnerable to SQL Injection if not careful)
// In a real production app, you should define specific routes for each action.
app.post('/api/query', async (req, res) => {
    const { text, params } = req.body;

    try {
        const result = await pool.query(text, params);
        res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
