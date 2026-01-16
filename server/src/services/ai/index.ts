import { IUser, IActivity, ICounselorNote, IActivitySnapshot, IStudentContext } from '../../models';
import { buildPayload } from './buildPayload';
import { callGemini, AIResponse } from './callGemini';
import { validateAIResponse } from './parseResponse';

export interface EvaluationResult {
  studentContext: IStudentContext;
  activitySnapshot: IActivitySnapshot[];
  scores: {
    leadershipImpact: number;
    executionDepth: number;
    growthTrajectory: number;
    contextAdjustedImpact: number;
    finalProfileiqScore: number;
  };
  scoreExplanations: {
    leadershipImpact: string;
    executionDepth: string;
    growthTrajectory: string;
    contextAdjustedImpact: string;
  };
  strengths: string[];
  improvementAreas: string[];
  guidanceRecommendations: {
    area: string;
    suggestion: string;
    expectedScoreImpact: string;
  }[];
  commonAppSummary: string[];
  aiModel: string;
  aiResponseTimeMs: number;
}

function calculateDurationMonths(startDate: Date, endDate?: Date): number {
  const end = endDate || new Date();
  const diffMs = end.getTime() - startDate.getTime();
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30)));
}

function transformResponse(
  aiResponse: AIResponse,
  user: IUser,
  activities: IActivity[],
  model: string,
  responseTimeMs: number
): EvaluationResult {
  const profile = user.profile!;

  return {
    studentContext: {
      gradeLevel: profile.gradeLevel,
      schoolType: profile.schoolType,
      geographicContext: profile.geographicContext,
      resourceConstraints: profile.resourceConstraints
    },
    activitySnapshot: activities.map(a => ({
      title: a.title,
      description: a.description,
      category: a.category,
      durationMonths: calculateDurationMonths(a.startDate, a.endDate),
      hoursPerWeek: a.hoursPerWeek,
      leadershipRole: a.leadershipRole,
      initiativeLevel: a.initiativeLevel,
      measurableOutcomes: a.measurableOutcomes,
      evidenceLinks: a.evidenceLinks
    })),
    scores: {
      leadershipImpact: aiResponse.scores.leadership_impact,
      executionDepth: aiResponse.scores.execution_depth,
      growthTrajectory: aiResponse.scores.growth_trajectory,
      contextAdjustedImpact: aiResponse.scores.context_adjusted_impact,
      finalProfileiqScore: aiResponse.scores.final_profileiq_score
    },
    scoreExplanations: {
      leadershipImpact: aiResponse.score_explanations.leadership_impact,
      executionDepth: aiResponse.score_explanations.execution_depth,
      growthTrajectory: aiResponse.score_explanations.growth_trajectory,
      contextAdjustedImpact: aiResponse.score_explanations.context_adjusted_impact
    },
    strengths: aiResponse.strengths,
    improvementAreas: aiResponse.improvement_areas,
    guidanceRecommendations: aiResponse.guidance_recommendations.map(r => ({
      area: r.area,
      suggestion: r.suggestion,
      expectedScoreImpact: r.expected_score_impact
    })),
    commonAppSummary: aiResponse.common_app_summary,
    aiModel: model,
    aiResponseTimeMs: responseTimeMs
  };
}

export async function evaluate(
  user: IUser,
  activities: IActivity[],
  counselorNotes: ICounselorNote[]
): Promise<EvaluationResult> {
  if (!user.profile) {
    throw new Error('User profile is required for evaluation');
  }

  if (activities.length === 0) {
    throw new Error('At least one activity is required for evaluation');
  }

  const payload = buildPayload(user.profile, activities, counselorNotes);
  const { response, responseTimeMs, model } = await callGemini(payload);

  if (!validateAIResponse(response)) {
    throw new Error('Invalid AI response format');
  }

  return transformResponse(response, user, activities, model, responseTimeMs);
}

export { buildPayload } from './buildPayload';
export { callGemini, AIResponse } from './callGemini';
export { validateAIResponse } from './parseResponse';
