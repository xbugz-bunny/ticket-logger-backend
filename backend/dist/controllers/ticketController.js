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
exports.assignUsers = exports.closeTicket = exports.getTickets = exports.createTicket = void 0;
const Ticket_1 = __importStar(require("../models/Ticket"));
const ActionLog_1 = __importStar(require("../models/ActionLog"));
const createTicket = async (req, res) => {
    try {
        const { departmentId, assignedUsers, questions, smtpConfig } = req.body;
        const actorId = req.user?.id;
        if (!actorId)
            return res.status(401).json({ message: 'Unauthorized' });
        const ticket = new Ticket_1.default({
            createdBy: actorId,
            departmentId,
            assignedUsers,
            questions,
            smtpConfig,
            status: Ticket_1.TicketStatus.Open
        });
        await ticket.save();
        // Log action
        const log = new ActionLog_1.default({
            actorId,
            actionType: ActionLog_1.ActionType.CreateTicket,
            targetId: ticket._id,
            details: { departmentId, questionsCount: questions.length }
        });
        await log.save();
        res.status(201).json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
    }
};
exports.createTicket = createTicket;
const getTickets = async (req, res) => {
    try {
        const { role, organizationId, departmentId, id } = req.user;
        let query = {};
        // RBAC filtering
        if (role === 'Admin') {
            query.departmentId = departmentId;
        }
        else if (role === 'User') {
            query.assignedUsers = id;
        }
        // SuperAdmin sees all
        const tickets = await Ticket_1.default.find(query)
            .populate('createdBy', 'name email')
            .populate('departmentId', 'name')
            .populate('assignedUsers', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(tickets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};
exports.getTickets = getTickets;
const closeTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const actorId = req.user?.id;
        const ticket = await Ticket_1.default.findById(id);
        if (!ticket)
            return res.status(404).json({ message: 'Ticket not found' });
        ticket.status = Ticket_1.TicketStatus.Closed;
        ticket.closedAt = new Date();
        await ticket.save();
        // Log action
        const log = new ActionLog_1.default({
            actorId,
            actionType: ActionLog_1.ActionType.CloseTicket,
            targetId: ticket._id
        });
        await log.save();
        res.status(200).json({ message: 'Ticket closed successfully', ticket });
    }
    catch (error) {
        res.status(500).json({ message: 'Error closing ticket', error: error.message });
    }
};
exports.closeTicket = closeTicket;
const assignUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const { userIds } = req.body;
        const ticket = await Ticket_1.default.findByIdAndUpdate(id, { assignedUsers: userIds }, { new: true })
            .populate('assignedUsers', 'name email');
        if (!ticket)
            return res.status(404).json({ message: 'Ticket not found' });
        res.status(200).json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: 'Error assigning users', error: error.message });
    }
};
exports.assignUsers = assignUsers;
