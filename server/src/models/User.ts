import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile {
  firstName: string;
  lastName: string;
  gradeLevel: string;
  schoolType: string;
  schoolName?: string;
  geographicContext: string;
  resourceConstraints?: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  role: 'student' | 'counselor';
  profile?: IUserProfile;
  assignedStudents?: mongoose.Types.ObjectId[];
  assignedCounselor?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  schoolType: { type: String, required: true },
  schoolName: { type: String },
  geographicContext: { type: String, required: true },
  resourceConstraints: { type: String }
}, { _id: false });

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'counselor'],
    required: true
  },
  profile: userProfileSchema,
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  assignedCounselor: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
