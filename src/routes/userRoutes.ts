import { getUsers, approveUser, getAllUsers, updateUserDepartment, updateUserRole, updateUserPermissions, getAdmins } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.use(authenticate);

// All users can list others for messaging
router.get('/list-all', getAllUsers);

// Admins and SuperAdmins can manage users
router.get('/', authorize([UserRole.SuperAdmin, UserRole.Admin]), getUsers);
router.get('/admins', authorize([UserRole.SuperAdmin]), getAdmins);
router.patch('/:id/approve', authorize([UserRole.SuperAdmin, UserRole.Admin]), approveUser);
router.patch('/:id/department', authorize([UserRole.SuperAdmin]), updateUserDepartment);
router.patch('/:id/role', authorize([UserRole.SuperAdmin]), updateUserRole);
router.patch('/:id/permissions', authorize([UserRole.SuperAdmin]), updateUserPermissions);

export default router;
