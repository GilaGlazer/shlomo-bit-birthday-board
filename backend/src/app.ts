import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env';
import errorHandler from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';
import authRoutes from './routes/authRoutes';
import personRoutes from './routes/personRoutes';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  sendSuccess(res, 200, { status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/people', personRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use(errorHandler);

export default app;
