import { Router } from 'express';
import { createTicket, getTickets, closeTicket, assignUsers } from '../controllers/ticketController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.use(authenticate);

// Admins and SuperAdmins can create tickets
router.post('/', authorize([UserRole.SuperAdmin, UserRole.Admin]), createTicket);

// All authenticated users can see tickets (filtered by RBAC in controller)
router.get('/', getTickets);

// Admins and SuperAdmins can close and assign tickets
router.patch('/:id/close', authorize([UserRole.SuperAdmin, UserRole.Admin]), closeTicket);
router.patch('/:id/assign', authorize([UserRole.SuperAdmin, UserRole.Admin]), assignUsers);

export default router;
