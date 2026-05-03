import mongoose, { Schema, Document } from 'mongoose';

export enum ResponseEvaluation {
  Positive = 'Positive',
  Negative = 'Negative',
  Pending = 'Pending',
}

export interface IResponse extends Document {
  ticketId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  answers: string[];
  evaluation: ResponseEvaluation;
  respondedAt: Date;
}

const ResponseSchema: Schema = new Schema(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{ type: String, required: true }],
    evaluation: { type: String, enum: Object.values(ResponseEvaluation), default: ResponseEvaluation.Pending },
    respondedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure a user can only respond once per ticket
ResponseSchema.index({ ticketId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IResponse>('Response', ResponseSchema);
