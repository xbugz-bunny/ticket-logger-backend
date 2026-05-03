import { Request, Response } from 'express';
import Ticket, { TicketStatus } from '../models/Ticket';
import { subDays, format } from 'date-fns';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { role, id, organizationId, departmentId } = req.user!;
    
    let query: any = {};
    if (role === 'User') {
      query.userId = id;
    } else if (role === 'Admin') {
      query.organizationId = organizationId;
      query.departmentId = departmentId;
    }
    // SuperAdmin query remains empty to see all

    const totalTickets = await Ticket.countDocuments(query);
    const openTickets = await Ticket.countDocuments({ ...query, status: TicketStatus.Open });
    const closedTickets = await Ticket.countDocuments({ ...query, status: TicketStatus.Closed });

    // 1. Ticket Trends (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), i);
      return format(d, 'MMM dd');
    }).reverse();

    const tickets = await Ticket.find({
      ...query,
      createdAt: { $gte: subDays(new Date(), 7) }
    });

    const activityData = last7Days.map(day => ({
      name: day,
      tickets: tickets.filter(t => format(new Date(t.createdAt), 'MMM dd') === day).length
    }));

    // 2. Status Distribution
    const statusData = [
      { name: 'Open', value: openTickets, color: '#e11d48' },
      { name: 'In Progress', value: await Ticket.countDocuments({ ...query, status: TicketStatus.InProgress }), color: '#f59e0b' },
      { name: 'Closed', value: closedTickets, color: '#10b981' }
    ];

    // 3. Department Distribution (Only for SuperAdmin)
    let departmentData: any[] = [];
    if (role === 'SuperAdmin') {
      const allTickets = await Ticket.find().populate('departmentId', 'name');
      const deptCounts: Record<string, number> = {};
      allTickets.forEach(t => {
        const dept = t.departmentId as any;
        const name = dept?.name || 'Unknown';
        deptCounts[name] = (deptCounts[name] || 0) + 1;
      });
      departmentData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
    } else if (role === 'Admin') {
      // For Admin, show ticket distribution by status in their department
      departmentData = statusData;
    }

    res.status(200).json({
      totalTickets,
      openTickets,
      closedTickets,
      activityData,
      statusData,
      departmentData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
