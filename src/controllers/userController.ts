import { Request, Response } from 'express';
import User, { UserStatus } from '../models/User';
import ActionLog, { ActionType } from '../models/ActionLog';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role, organizationId } = req.user!;
    let query: any = {};

    if (role === 'Admin') {
      query.organizationId = organizationId;
    }
    // SuperAdmin sees all

    const users = await User.find(query)
      .populate('organizationId', 'name')
      .populate('departmentId', 'name')
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const approveUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const actor = req.user!;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = UserStatus.Approved;
    
    // Only update org/dept if the actor is an Admin (SuperAdmin can set them manually later or leave as is)
    if (actor.role === 'Admin') {
      user.organizationId = actor.organizationId as any;
      user.departmentId = actor.departmentId as any;
    }

    await user.save();

    // Log action
    const log = new ActionLog({
      actorId: actor.id,
      actionType: ActionType.ApproveUser,
      targetId: user._id
    });
    await log.save();

    res.status(200).json({ message: 'User approved successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error approving user', error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, organizationId } = req.user!;
    let query: any = {};

    if (role === 'Admin' || role === 'User') {
      query.organizationId = organizationId;
    }

    const users = await User.find(query).select('name email role');
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const updateUserDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { departmentId } = req.body;

    const user = await User.findByIdAndUpdate(id, { departmentId }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Department updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating department', error: error.message });
  }
};
