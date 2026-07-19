import authRouter from './routes/auth';
import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);


export default app