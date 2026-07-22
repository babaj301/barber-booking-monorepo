import authRouter from './routes/auth';
import barberRouter from './routes/barber';
import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/barber', barberRouter);

export default app;
