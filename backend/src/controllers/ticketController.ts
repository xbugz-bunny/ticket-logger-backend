import { Request, Response } from 'express';
import Ticket, { TicketStatus } from '../models/Ticket';
import ActionLog, { ActionType } from '../models/ActionLog';
import User from '../models/User';

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { departmentId, assignedUsers, questions, smtpConfig } = req.body;
    const actorId = req.user?.id;

    if (!actorId) return res.status(401).json({ message: 'Unauthorized' });

    const ticket = new Ticket({
      createdBy: actorId,
      departmentId,
      assignedUsers,
      questions,
      smtpConfig,
      status: TicketStatus.Open
    });

    await ticket.save();

    // Log action
    const log = new ActionLog({
      actorId,
      actionType: ActionType.CreateTicket,
      targetId: ticket._id,
      details: { departmentId, questionsCount: questions.length }
    });
    await log.save();

    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const { role, organizationId, departmentId, id } = req.user!;
    let query: any = {};

    // RBAC filtering
    if (role === 'Admin') {
      query.departmentId = departmentId;
    } else if (role === 'User') {
      query.assignedUsers = id;
    }
    // SuperAdmin sees all

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('departmentId', 'name')
      .populate('assignedUsers', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

export const closeTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const actorId = req.user?.id;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = TicketStatus.Closed;
    ticket.closedAt = new Date();
    await ticket.save();

    // Log action
    const log = new ActionLog({
      actorId,
      actionType: ActionType.CloseTicket,
      targetId: ticket._id
    });
    await log.save();

    res.status(200).json({ message: 'Ticket closed successfully', ticket });
  } catch (error: any) {
    res.status(500).json({ message: 'Error closing ticket', error: error.message });
  }
};

export const assignUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(id, { assignedUsers: userIds }, { new: true })
      .populate('assignedUsers', 'name email');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.status(200).json(ticket);
  } catch (error: any) {
    res.status(500).json({ message: 'Error assigning users', error: error.message });
  }
};
