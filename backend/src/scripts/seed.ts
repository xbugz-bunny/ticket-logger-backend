import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User, { UserRole, UserStatus } from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket_logger';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if SuperAdmin already exists
    const existingAdmin = await User.findOne({ email: 'admin@ticketlogger.com' });
    if (existingAdmin) {
      existingAdmin.name = 'Malik Muhammad Haseeb';
      await existingAdmin.save();
      console.log('SuperAdmin updated successfully');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin123!', salt);

    const superAdmin = new User({
      name: 'Malik Muhammad Haseeb',
      email: 'admin@ticketlogger.com',
      passwordHash,
      role: UserRole.SuperAdmin,
      status: UserStatus.Approved
    });

    await superAdmin.save();
    console.log('SuperAdmin created successfully! Credentials: admin@ticketlogger.com / Admin123!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
