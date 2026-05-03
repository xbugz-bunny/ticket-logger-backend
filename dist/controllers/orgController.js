"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentsByOrg = exports.createDepartment = exports.getOrganizations = exports.createOrganization = void 0;
const Organization_1 = __importDefault(require("../models/Organization"));
const Department_1 = __importDefault(require("../models/Department"));
const createOrganization = async (req, res) => {
    try {
        const { name } = req.body;
        const existingOrg = await Organization_1.default.findOne({ name });
        if (existingOrg) {
            return res.status(400).json({ message: 'Organization name already exists' });
        }
        const org = new Organization_1.default({ name });
        await org.save();
        res.status(201).json(org);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating organization', error: error.message });
    }
};
exports.createOrganization = createOrganization;
const getOrganizations = async (req, res) => {
    try {
        const orgs = await Organization_1.default.find();
        res.status(200).json(orgs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching organizations', error: error.message });
    }
};
exports.getOrganizations = getOrganizations;
const createDepartment = async (req, res) => {
    try {
        const { name, organizationId } = req.body;
        const existingDept = await Department_1.default.findOne({ name, organizationId });
        if (existingDept) {
            return res.status(400).json({ message: 'Department already exists in this organization' });
        }
        const dept = new Department_1.default({ name, organizationId });
        await dept.save();
        res.status(201).json(dept);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
};
exports.createDepartment = createDepartment;
const getDepartmentsByOrg = async (req, res) => {
    try {
        const { orgId } = req.params;
        const depts = await Department_1.default.find({ organizationId: orgId });
        res.status(200).json(depts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
};
exports.getDepartmentsByOrg = getDepartmentsByOrg;
