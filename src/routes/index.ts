import { Router } from 'express';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'Alma API — ready for routes (products, orders, auth, …)' });
});
