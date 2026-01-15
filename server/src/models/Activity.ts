import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate?: Date;
  hoursPerWeek: number;
  leadershipRole: string;
  initiativeLevel: 'self-started' | 'co-led' | 'participant';
  measurableOutcomes?: string;
  evidenceLinks?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['club', 'volunteer', 'work', 'research', 'personal_project', 'arts', 'athletics', 'other'],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  hoursPerWeek: { type: Number, required: true, min: 0 },
  leadershipRole: {
    type: String,
    enum: ['founder', 'president', 'officer', 'member', 'none'],
    required: true
  },
  initiativeLevel: {
    type: String,
    enum: ['self-started', 'co-led', 'participant'],
    required: true
  },
  measurableOutcomes: { type: String },
  evidenceLinks: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

activitySchema.index({ userId: 1, isActive: 1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
