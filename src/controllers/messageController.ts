import { Request, Response } from 'express';
import Message from '../models/Message';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, subject, body } = req.body;
    const senderId = req.user?.id;

    const message = new Message({
      senderId,
      receiverId,
      subject,
      body
    });

    await message.save();
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

export const getInbox = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const messages = await Message.find({ receiverId: userId })
      .populate('senderId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching inbox', error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating message', error: error.message });
  }
};
