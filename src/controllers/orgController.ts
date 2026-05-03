import { Request, Response } from 'express';
import Organization from '../models/Organization';
import Department from '../models/Department';

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
