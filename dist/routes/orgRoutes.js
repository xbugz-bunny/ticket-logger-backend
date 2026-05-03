"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orgController_1 = require("../controllers/orgController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// SuperAdmin only
router.post('/organizations', (0, auth_1.authorize)([User_1.UserRole.SuperAdmin]), orgController_1.createOrganization);
router.post('/departments', (0, auth_1.authorize)([User_1.UserRole.SuperAdmin]), orgController_1.createDepartment);
// Available to authenticated users
router.get('/organizations', orgController_1.getOrganizations);
router.get('/organizations/:orgId/departments', orgController_1.getDepartmentsByOrg);
exports.default = router;
