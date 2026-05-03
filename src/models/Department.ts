import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  },
  { timestamps: true }
);

// Ensure unique department name within an organization
DepartmentSchema.index({ name: 1, organizationId: 1 }, { unique: true });

export default mongoose.model<IDepartment>('Department', DepartmentSchema);
