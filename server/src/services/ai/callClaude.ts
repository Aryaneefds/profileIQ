import Anthropic from '@anthropic-ai/sdk';
import { PROFILEIQ_SYSTEM_PROMPT } from './profileiqPrompt';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export interface AIResponse {
  scores: {
    leadership_impact: number;
    execution_depth: number;
    growth_trajectory: number;
    context_adjusted_impact: number;
    final_profileiq_score: number;
  };
  score_explanations: {
    leadership_impact: string;
    execution_depth: string;
    growth_trajectory: string;
    context_adjusted_impact: string;
  };
  strengths: string[];
  improvement_areas: string[];
  guidance_recommendations: {
    area: string;
    suggestion: string;
    expected_score_impact: string;
  }[];
  common_app_summary: string[];
}

export async function callClaude(payload: object): Promise<{ response: AIResponse; responseTimeMs: number; model: string }> {
  const startTime = Date.now();
  const model = 'claude-sonnet-4-20250514';

  const message = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: JSON.stringify(payload)
      }
    ],
    system: PROFILEIQ_SYSTEM_PROMPT
  });

  const responseTimeMs = Date.now() - startTime;

  const textBlock = message.content.find(block => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from AI');
  }

  const responseText = textBlock.text.trim();

  // Try to extract JSON if wrapped in markdown code blocks
  let jsonText = responseText;
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  const response = JSON.parse(jsonText) as AIResponse;

  return { response, responseTimeMs, model };
}
