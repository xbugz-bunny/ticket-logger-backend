"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// All users can list others for messaging
router.get('/list-all', userController_1.getAllUsers);
// Admins and SuperAdmins can manage users
router.get('/', (0, auth_1.authorize)([User_1.UserRole.SuperAdmin, User_1.UserRole.Admin]), userController_1.getUsers);
router.patch('/:id/approve', (0, auth_1.authorize)([User_1.UserRole.SuperAdmin, User_1.UserRole.Admin]), userController_1.approveUser);
exports.default = router;
