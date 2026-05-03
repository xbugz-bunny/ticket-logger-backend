import mongoose, { Schema, Document } from 'mongoose';

export enum ActionType {
  CreateTicket = 'CreateTicket',
  CloseTicket = 'CloseTicket',
  EvaluateResponse = 'EvaluateResponse',
  CreateUser = 'CreateUser',
  ApproveUser = 'ApproveUser',
  CreateOrganization = 'CreateOrganization',
  CreateDepartment = 'CreateDepartment',
  Login = 'Login',
  UpdateSMTP = 'UpdateSMTP',
}

export interface IActionLog extends Document {
  actorId: mongoose.Types.ObjectId;
  actionType: ActionType;
  targetId?: mongoose.Types.ObjectId; // E.g., ticketId, userId depending on action
  details?: Record<string, any>;
  timestamp: Date;
}

const ActionLogSchema: Schema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: { type: String, enum: Object.values(ActionType), required: true },
    targetId: { type: Schema.Types.ObjectId },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IActionLog>('ActionLog', ActionLogSchema);
