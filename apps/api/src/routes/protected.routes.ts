import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/profile', (req, res) => {
  res.json({
    message: 'Protected route — JWT verified',
    user: req.user,
  });
});

export default router;
