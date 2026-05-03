import { Request, Response } from 'express';
import Organization from '../models/Organization';
import Department from '../models/Department';
import User from '../models/User';
import Ticket, { TicketStatus } from '../models/Ticket';

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const existingOrg = await Organization.findOne({ name });
    
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization name already exists' });
    }

    const org = new Organization({ name });
    await org.save();

    res.status(201).json(org);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating organization', error: error.message });
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await Organization.find();
    res.status(200).json(orgs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching organizations', error: error.message });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, organizationId } = req.body;
    const existingDept = await Department.findOne({ name, organizationId });
    
    if (existingDept) {
      return res.status(400).json({ message: 'Department already exists in this organization' });
    }

    const dept = new Department({ name, organizationId });
    await dept.save();

    res.status(201).json(dept);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating department', error: error.message });
  }
};

export const getDepartmentsByOrg = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const depts = await Department.find({ organizationId: orgId });
    res.status(200).json(depts);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const depts = await Department.find().populate('organizationId', 'name');
    res.status(200).json(depts);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching all departments', error: error.message });
  }
};

export const renameDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const dept = await Department.findByIdAndUpdate(id, { name }, { new: true });
    res.status(200).json(dept);
  } catch (error: any) {
    res.status(500).json({ message: 'Error renaming department', error: error.message });
  }
};

export const getDepartmentDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const users = await User.find({ departmentId: id }).select('name email role status');
    
    const members = users.map(u => ({
      ...u.toObject(),
      isPresent: Math.random() > 0.3 // Mocking presence
    }));

    const totalTicketsToday = await Ticket.countDocuments({ 
      departmentId: id, 
      createdAt: { $gte: startOfToday } 
    });

    const openTicketsToday = await Ticket.countDocuments({ 
      departmentId: id, 
      status: TicketStatus.Open,
      createdAt: { $gte: startOfToday } 
    });

    res.status(200).json({
      members,
      totalMembers: users.length,
      stats: {
        totalTicketsToday,
        openTicketsToday
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching department details', error: error.message });
  }
};
