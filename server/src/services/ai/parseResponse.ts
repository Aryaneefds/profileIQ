import { AIResponse } from './callGemini';

export function validateAIResponse(response: unknown): response is AIResponse {
  if (!response || typeof response !== 'object') return false;

  const r = response as AIResponse;

  // Validate scores
  if (!r.scores || typeof r.scores !== 'object') return false;
  const scoreFields = ['leadership_impact', 'execution_depth', 'growth_trajectory', 'context_adjusted_impact', 'final_profileiq_score'];
  for (const field of scoreFields) {
    const value = r.scores[field as keyof typeof r.scores];
    if (typeof value !== 'number' || value < 0 || value > 100) return false;
  }

  // Validate explanations
  if (!r.score_explanations || typeof r.score_explanations !== 'object') return false;
  const explanationFields = ['leadership_impact', 'execution_depth', 'growth_trajectory', 'context_adjusted_impact'];
  for (const field of explanationFields) {
    if (typeof r.score_explanations[field as keyof typeof r.score_explanations] !== 'string') return false;
  }

  // Validate arrays
  if (!Array.isArray(r.strengths)) return false;
  if (!Array.isArray(r.improvement_areas)) return false;
  if (!Array.isArray(r.guidance_recommendations)) return false;
  if (!Array.isArray(r.common_app_summary)) return false;

  // Validate guidance recommendations structure
  for (const rec of r.guidance_recommendations) {
    if (typeof rec.area !== 'string') return false;
    if (typeof rec.suggestion !== 'string') return false;
    if (typeof rec.expected_score_impact !== 'string') return false;
  }

  return true;
}
