import { Router } from 'express';
import { sendMessage, getInbox, markAsRead } from '../controllers/messageController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.patch('/:id/read', markAsRead);

export default router;
