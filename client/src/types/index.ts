export interface User {
  id: string;
  email: string;
  role: 'student' | 'counselor';
  profile?: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  gradeLevel: string;
  schoolType: string;
  schoolName?: string;
  geographicContext: string;
  resourceConstraints?: string;
}

export interface Activity {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate?: string;
  hoursPerWeek: number;
  leadershipRole: string;
  initiativeLevel: 'self-started' | 'co-led' | 'participant';
  measurableOutcomes?: string;
  evidenceLinks?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Scores {
  leadershipImpact: number;
  executionDepth: number;
  growthTrajectory: number;
  contextAdjustedImpact: number;
  finalProfileiqScore: number;
}

export interface ScoreExplanations {
  leadershipImpact: string;
  executionDepth: string;
  growthTrajectory: string;
  contextAdjustedImpact: string;
}

export interface GuidanceRecommendation {
  area: string;
  suggestion: string;
  expectedScoreImpact: string;
}

export interface ActivitySnapshot {
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

export interface Evaluation {
  _id: string;
  userId: string;
  studentContext: {
    gradeLevel: string;
    schoolType: string;
    geographicContext: string;
    resourceConstraints?: string;
  };
  activitySnapshot: ActivitySnapshot[];
  scores: Scores;
  scoreExplanations: ScoreExplanations;
  strengths: string[];
  improvementAreas: string[];
  guidanceRecommendations: GuidanceRecommendation[];
  commonAppSummary: string[];
  aiModel: string;
  aiResponseTimeMs: number;
  createdAt: string;
}

export interface CounselorNote {
  _id: string;
  counselorId: string;
  studentId: string;
  content: string;
  category: 'general' | 'strength' | 'concern' | 'recommendation';
  createdAt: string;
  updatedAt: string;
}

export interface StudentSummary {
  profile: UserProfile;
  activityCount: number;
  recentActivities: Activity[];
  latestScore: number | null;
  evaluationCount: number;
  lastEvaluationDate: string | null;
}

export interface CounselorStudent {
  id: string;
  email: string;
  profile: UserProfile;
  activityCount: number;
  latestScore: number | null;
  lastEvaluationDate: string | null;
}
