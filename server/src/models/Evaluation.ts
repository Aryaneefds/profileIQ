import mongoose, { Document, Schema } from 'mongoose';

export interface IScores {
  leadershipImpact: number;
  executionDepth: number;
  growthTrajectory: number;
  contextAdjustedImpact: number;
  finalProfileiqScore: number;
}

export interface IScoreExplanations {
  leadershipImpact: string;
  executionDepth: string;
  growthTrajectory: string;
  contextAdjustedImpact: string;
}

export interface IGuidanceRecommendation {
  area: string;
  suggestion: string;
  expectedScoreImpact: string;
}

export interface IActivitySnapshot {
  title: string;
  description: string;
  category: string;
  durationMonths: number;
  hoursPerWeek: number;
  leadershipRole: string;
  initiativeLevel: string;
  measurableOutcomes?: string;
  evidenceLinks?: string[];
}

export interface IStudentContext {
  gradeLevel: string;
  schoolType: string;
  geographicContext: string;
  resourceConstraints?: string;
}

export interface IEvaluation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  studentContext: IStudentContext;
  activitySnapshot: IActivitySnapshot[];
  scores: IScores;
  scoreExplanations: IScoreExplanations;
  strengths: string[];
  improvementAreas: string[];
  guidanceRecommendations: IGuidanceRecommendation[];
  commonAppSummary: string[];
  counselorNoteIds?: mongoose.Types.ObjectId[];
  aiModel: string;
  aiResponseTimeMs: number;
  createdAt: Date;
}

const studentContextSchema = new Schema<IStudentContext>({
  gradeLevel: { type: String, required: true },
  schoolType: { type: String, required: true },
  geographicContext: { type: String, required: true },
  resourceConstraints: { type: String }
}, { _id: false });

const activitySnapshotSchema = new Schema<IActivitySnapshot>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  durationMonths: { type: Number, required: true },
  hoursPerWeek: { type: Number, required: true },
  leadershipRole: { type: String, required: true },
  initiativeLevel: { type: String, required: true },
  measurableOutcomes: { type: String },
  evidenceLinks: [{ type: String }]
}, { _id: false });

const scoresSchema = new Schema<IScores>({
  leadershipImpact: { type: Number, required: true, min: 0, max: 100 },
  executionDepth: { type: Number, required: true, min: 0, max: 100 },
  growthTrajectory: { type: Number, required: true, min: 0, max: 100 },
  contextAdjustedImpact: { type: Number, required: true, min: 0, max: 100 },
  finalProfileiqScore: { type: Number, required: true, min: 0, max: 100 }
}, { _id: false });

const scoreExplanationsSchema = new Schema<IScoreExplanations>({
  leadershipImpact: { type: String, required: true },
  executionDepth: { type: String, required: true },
  growthTrajectory: { type: String, required: true },
  contextAdjustedImpact: { type: String, required: true }
}, { _id: false });

const guidanceRecommendationSchema = new Schema<IGuidanceRecommendation>({
  area: { type: String, required: true },
  suggestion: { type: String, required: true },
  expectedScoreImpact: { type: String, required: true }
}, { _id: false });

const evaluationSchema = new Schema<IEvaluation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  studentContext: { type: studentContextSchema, required: true },
  activitySnapshot: [activitySnapshotSchema],
  scores: { type: scoresSchema, required: true },
  scoreExplanations: { type: scoreExplanationsSchema, required: true },
  strengths: [{ type: String }],
  improvementAreas: [{ type: String }],
  guidanceRecommendations: [guidanceRecommendationSchema],
  commonAppSummary: [{ type: String }],
  counselorNoteIds: [{ type: Schema.Types.ObjectId, ref: 'CounselorNote' }],
  aiModel: { type: String, required: true },
  aiResponseTimeMs: { type: Number, required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

evaluationSchema.index({ userId: 1, createdAt: -1 });

export const Evaluation = mongoose.model<IEvaluation>('Evaluation', evaluationSchema);
