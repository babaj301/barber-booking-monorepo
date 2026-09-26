import authRouter from './routes/auth';
import barberRouter from './routes/barber';
import servicesRouter from './routes/services';
import appointmentsRouter from './routes/appointments';
import availabilityRouter from './routes/availability';
import express, { Request, Response } from 'express';
import cookierParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookierParser());

app.use('/api/auth', authRouter);
app.use('/api/barber', barberRouter);
app.use('/api/services', servicesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/availability', availabilityRouter);

export default app;
