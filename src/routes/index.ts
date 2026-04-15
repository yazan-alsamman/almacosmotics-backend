import { Router } from 'express';
import { authRouter } from './auth.js';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'Alma API — ready for routes (products, orders, auth, …)' });
});

apiRouter.use('/auth', authRouter);
