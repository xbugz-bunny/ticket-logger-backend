import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getDashboardStats);

export default router;
