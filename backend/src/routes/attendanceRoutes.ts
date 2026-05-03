import { Router } from 'express';
import { logAttendance, getAttendance } from '../controllers/attendanceController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

// Pulse endpoint to log active status
router.post('/pulse', logAttendance);

// View logs
router.get('/', getAttendance);

export default router;
