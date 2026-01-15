import mongoose, { Document, Schema } from 'mongoose';

export interface ICounselorNote extends Document {
  _id: mongoose.Types.ObjectId;
  counselorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  content: string;
  category: 'general' | 'strength' | 'concern' | 'recommendation';
  createdAt: Date;
  updatedAt: Date;
}

const counselorNoteSchema = new Schema<ICounselorNote>({
  counselorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['general', 'strength', 'concern', 'recommendation'],
    required: true
  }
}, {
  timestamps: true
});

counselorNoteSchema.index({ studentId: 1, createdAt: -1 });

export const CounselorNote = mongoose.model<ICounselorNote>('CounselorNote', counselorNoteSchema);
