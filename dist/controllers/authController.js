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
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_12345';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const register = async (req, res) => {
    try {
        const { name, email, password, role, organizationId, departmentId } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // If it's a superadmin creating themselves initially, auto-approve. Otherwise, pending.
        // In a real scenario, you'd protect this route and prevent arbitrary SuperAdmin creation.
        const status = role === User_1.UserRole.SuperAdmin ? User_1.UserStatus.Approved : User_1.UserStatus.Pending;
        const newUser = new User_1.default({
            name,
            email,
            passwordHash,
            role: role || User_1.UserRole.User,
            organizationId,
            departmentId,
            status
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', userId: newUser._id, status: newUser.status });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.status !== User_1.UserStatus.Approved) {
            return res.status(403).json({ message: 'Your account is pending approval' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const payload = {
            id: user._id,
            role: user.role,
            organizationId: user.organizationId,
            departmentId: user.departmentId,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId,
                departmentId: user.departmentId,
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};
exports.getMe = getMe;
