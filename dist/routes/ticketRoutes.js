"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Admins and SuperAdmins can create tickets
router.post('/', (0, auth_1.authorize)([User_1.UserRole.SuperAdmin, User_1.UserRole.Admin]), ticketController_1.createTicket);
// All authenticated users can see tickets (filtered by RBAC in controller)
router.get('/', ticketController_1.getTickets);
// Admins and SuperAdmins can close and assign tickets
router.patch('/:id/close', (0, auth_1.authorize)([User_1.UserRole.SuperAdmin, User_1.UserRole.Admin]), ticketController_1.closeTicket);
router.patch('/:id/assign', (0, auth_1.authorize)([User_1.UserRole.SuperAdmin, User_1.UserRole.Admin]), ticketController_1.assignUsers);
exports.default = router;
