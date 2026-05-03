import { Request, Response } from 'express';
import Attendance, { AttendanceStatus } from '../models/Attendance';
import { startOfDay, format } from 'date-fns';

export const logAttendance = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const today = format(new Date(), 'yyyy-MM-dd');

    let attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
      attendance = new Attendance({
        userId,
        date: today,
        loginTime: new Date(),
        lastActive: new Date(),
        status: AttendanceStatus.Present
      });
    } else {
      attendance.lastActive = new Date();
    }

    await attendance.save();
    res.status(200).json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging attendance', error: error.message });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { role, organizationId, id } = req.user!;
    let query: any = {};

    if (role === 'Admin') {
      // Find all users in the same organization
      const users = await User.find({ organizationId }).select('_id');
      query.userId = { $in: users.map(u => u._id) };
    } else if (role === 'User') {
      query.userId = id;
    }
    // SuperAdmin sees all

    const logs = await Attendance.find(query)
      .populate('userId', 'name email role')
      .sort({ date: -1, lastActive: -1 });

    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

import User from '../models/User'; // Needed for Admin query
