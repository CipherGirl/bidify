import cors from 'cors';
import express from 'express';

import passport from './middleware/auth.middleware.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import { AuthRoutes } from './routes/auth.route.js';
import { UserRoutes } from './routes/user.route.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/users', UserRoutes);

app.use(globalErrorHandler);

export default app;
