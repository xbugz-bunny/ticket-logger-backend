"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getInbox = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const sendMessage = async (req, res) => {
    try {
        const { receiverId, subject, body } = req.body;
        const senderId = req.user?.id;
        const message = new Message_1.default({
            senderId,
            receiverId,
            subject,
            body
        });
        await message.save();
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};
exports.sendMessage = sendMessage;
const getInbox = async (req, res) => {
    try {
        const userId = req.user?.id;
        const messages = await Message_1.default.find({ receiverId: userId })
            .populate('senderId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inbox', error: error.message });
    }
};
exports.getInbox = getInbox;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Message_1.default.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ message: 'Message marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating message', error: error.message });
    }
};
exports.markAsRead = markAsRead;
