"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendanceController_1 = require("../controllers/attendanceController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Pulse endpoint to log active status
router.post('/pulse', attendanceController_1.logAttendance);
// View logs
router.get('/', attendanceController_1.getAttendance);
exports.default = router;
