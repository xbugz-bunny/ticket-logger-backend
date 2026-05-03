import mongoose, { Schema, Document } from 'mongoose';

export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
}

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  loginTime: Date;
  lastActive: Date;
  status: AttendanceStatus;
}

const AttendanceSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    loginTime: { type: Date, required: true },
    lastActive: { type: Date, required: true },
    status: { type: String, enum: Object.values(AttendanceStatus), default: AttendanceStatus.Present },
  },
  { timestamps: true }
);

// Ensure a user has only one attendance record per day
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
