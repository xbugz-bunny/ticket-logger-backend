import { Router } from 'express';
import { createOrganization, getOrganizations, createDepartment, getDepartmentsByOrg, getAllDepartments } from '../controllers/orgController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.use(authenticate);

// SuperAdmin only
router.post('/organizations', authorize([UserRole.SuperAdmin]), createOrganization);
router.post('/departments', authorize([UserRole.SuperAdmin]), createDepartment);

// Available to authenticated users
router.get('/organizations', getOrganizations);
router.get('/departments', getAllDepartments);
router.get('/organizations/:orgId/departments', getDepartmentsByOrg);

export default router;
