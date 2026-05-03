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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.approveUser = exports.getUsers = void 0;
const User_1 = __importStar(require("../models/User"));
const ActionLog_1 = __importStar(require("../models/ActionLog"));
const getUsers = async (req, res) => {
    try {
        const { role, organizationId } = req.user;
        let query = {};
        if (role === 'Admin') {
            query.organizationId = organizationId;
        }
        // SuperAdmin sees all
        const users = await User_1.default.find(query)
            .populate('organizationId', 'name')
            .populate('departmentId', 'name')
            .select('-passwordHash')
            .sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
exports.getUsers = getUsers;
const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const actorId = req.user?.id;
        const user = await User_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        user.status = User_1.UserStatus.Approved;
        await user.save();
        // Log action
        const log = new ActionLog_1.default({
            actorId,
            actionType: ActionLog_1.ActionType.ApproveUser,
            targetId: user._id
        });
        await log.save();
        res.status(200).json({ message: 'User approved successfully', user });
    }
    catch (error) {
        res.status(500).json({ message: 'Error approving user', error: error.message });
    }
};
exports.approveUser = approveUser;
const getAllUsers = async (req, res) => {
    try {
        const { role, organizationId } = req.user;
        let query = {};
        if (role === 'Admin' || role === 'User') {
            query.organizationId = organizationId;
        }
        const users = await User_1.default.find(query).select('name email role');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
