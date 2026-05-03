"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendance = exports.logAttendance = void 0;
const Attendance_1 = __importStar(require("../models/Attendance"));
const date_fns_1 = require("date-fns");
const logAttendance = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const today = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
        let attendance = await Attendance_1.default.findOne({ userId, date: today });
        if (!attendance) {
            attendance = new Attendance_1.default({
                userId,
                date: today,
                loginTime: new Date(),
                lastActive: new Date(),
                status: Attendance_1.AttendanceStatus.Present
            });
        }
        else {
            attendance.lastActive = new Date();
        }
        await attendance.save();
        res.status(200).json(attendance);
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging attendance', error: error.message });
    }
};
exports.logAttendance = logAttendance;
const getAttendance = async (req, res) => {
    try {
        const { role, organizationId, id } = req.user;
        let query = {};
        if (role === 'Admin') {
            // Find all users in the same organization
            const users = await User_1.default.find({ organizationId }).select('_id');
            query.userId = { $in: users.map(u => u._id) };
        }
        else if (role === 'User') {
            query.userId = id;
        }
        // SuperAdmin sees all
        const logs = await Attendance_1.default.find(query)
            .populate('userId', 'name email role')
            .sort({ date: -1, lastActive: -1 });
        res.status(200).json(logs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
};
exports.getAttendance = getAttendance;
const User_1 = __importDefault(require("../models/User")); // Needed for Admin query
