import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import orgRoutes from './routes/orgRoutes';
import ticketRoutes from './routes/ticketRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import statsRoutes from './routes/statsRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Ticket Logger API is running' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket_logger';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
