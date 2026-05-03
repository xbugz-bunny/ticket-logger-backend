import mongoose, { Schema, Document } from 'mongoose';

export enum TicketStatus {
  Open = 'Open',
  Closed = 'Closed',
}

export interface ITicket extends Document {
  createdBy: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  assignedUsers: mongoose.Types.ObjectId[];
  questions: string[];
  status: TicketStatus;
  smtpConfig?: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

const TicketSchema: Schema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    assignedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    questions: [{ type: String, required: true }],
    status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.Open },
    smtpConfig: {
      host: { type: String },
      port: { type: Number },
      user: { type: String },
      pass: { type: String },
    },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ITicket>('Ticket', TicketSchema);
