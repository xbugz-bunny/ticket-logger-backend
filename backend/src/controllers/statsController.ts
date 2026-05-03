import { Request, Response } from 'express';
import Ticket, { TicketStatus } from '../models/Ticket';
import Attendance from '../models/Attendance';
import User from '../models/User';
import { subDays, startOfDay, format } from 'date-fns';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { role, organizationId, departmentId } = req.user!;
    let query: any = {};

    if (role === 'Admin') {
      query.departmentId = departmentId;
    } else if (role === 'User') {
      query.assignedUsers = req.user!.id;
    }

    // 1. Core Stats
    const totalTickets = await Ticket.countDocuments(query);
    const openTickets = await Ticket.countDocuments({ ...query, status: TicketStatus.Open });
    const closedTickets = await Ticket.countDocuments({ ...query, status: TicketStatus.Closed });

    // 2. Ticket Status Distribution (for Pie Chart)
    const statusData = [
      { name: 'Open', value: openTickets, color: '#e11d48' },
      { name: 'Closed', value: closedTickets, color: '#10b981' }
    ];

    // 3. Activity over last 7 days (for Area Chart)
    const activityData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const count = await Ticket.countDocuments({
        ...query,
        createdAt: {
          $gte: startOfDay(date),
          $lte: new Date(date.setHours(23, 59, 59, 999))
        }
      });
      
      activityData.push({
        name: format(date, 'MMM dd'),
        tickets: count
      });
    }

    // 4. Department Distribution (Only for SuperAdmin)
    let departmentData: any[] = [];
    if (role === 'SuperAdmin') {
      const tickets = await Ticket.find().populate('departmentId', 'name');
      const deptCounts: Record<string, number> = {};
      tickets.forEach(t => {
        const dept = t.departmentId as any;
        const name = dept?.name || 'Unknown';
        deptCounts[name] = (deptCounts[name] || 0) + 1;
      });
      departmentData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
    }

    res.status(200).json({
      totalTickets,
      openTickets,
      closedTickets,
      statusData,
      activityData,
      departmentData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
