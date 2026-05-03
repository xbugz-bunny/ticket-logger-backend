import { Router } from 'express';
import { getUsers, approveUser, getAllUsers } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.use(authenticate);

// All users can list others for messaging
router.get('/list-all', getAllUsers);

// Admins and SuperAdmins can manage users
router.get('/', authorize([UserRole.SuperAdmin, UserRole.Admin]), getUsers);
router.patch('/:id/approve', authorize([UserRole.SuperAdmin, UserRole.Admin]), approveUser);

export default router;
