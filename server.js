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
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5433,
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

    console.log('[SQL Query]:', text);
    console.log('[Params]:', params);

    try {
        const result = await pool.query(text, params);
        console.log('[Query Success] Rows returned:', result.rowCount);
        res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (err) {
        console.error('[Query Error]:', err.message);
        console.error('[Detail]:', err.detail || 'No additional details');
        console.error('[Constraint]:', err.constraint || 'N/A');

        // Send user-friendly error messages
        let userMessage = err.message;
        if (err.constraint === 'fk_trans_destino') {
            userMessage = 'La cuenta destino no existe. Verifica el número de cuenta.';
        } else if (err.constraint === 'fk_trans_origen') {
            userMessage = 'La cuenta origen no existe.';
        } else if (err.code === '23505') {
            userMessage = 'Ya existe un registro con esos datos.';
        } else if (err.code === '23503') {
            userMessage = 'Referencia inválida en la base de datos.';
        }

        res.status(500).json({
            error: userMessage,
            code: err.code,
            constraint: err.constraint
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
