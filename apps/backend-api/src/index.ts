import express, { Request, Response } from 'express';
import { AppointmentStatus } from '@barber-booking/types';
import pool from './db';

const app = express();
const PORT = process.env.PORT || 5001;

// This middleware tells Express to parse incoming JSON request bodies.
// Without this, `req.body` will be undefined!
app.use(express.json());

// A simple "health check" endpoint to verify our server is alive.
app.get('/health', async (req: Request, res: Response) => {
  let dbstatus = 'disconnected';

  try {
    const dbCheck = await pool.query('SELECT NOW()');
    if (dbCheck.rows.length > 0) {
      dbstatus = 'connected';
    }
  } catch (err) {
    console.error('Database health check failed:', err);
  }

  const status: AppointmentStatus = 'pending';

  res.json({
    status: 'healthy',
    dbstatus: dbstatus,
    testTypeStatus: status,
  });
});

app.listen(PORT, () => {
  console.log(`Monolith Backend running on http://localhost:${PORT}`);
});
