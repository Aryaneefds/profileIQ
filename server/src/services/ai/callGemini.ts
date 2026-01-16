import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROFILEIQ_SYSTEM_PROMPT } from './profileiqPrompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

export async function callGemini(payload: object): Promise<{ response: AIResponse; responseTimeMs: number; model: string }> {
    const startTime = Date.now();
    const model = 'gemini-2.5-flash-lite';

    const geminiModel = genAI.getGenerativeModel({
        model,
        systemInstruction: PROFILEIQ_SYSTEM_PROMPT
    });

    const result = await geminiModel.generateContent(JSON.stringify(payload));
    const responseTimeMs = Date.now() - startTime;

    const responseText = result.response.text().trim();

    // Try to extract JSON if wrapped in markdown code blocks
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        jsonText = jsonMatch[1];
    }

    const response = JSON.parse(jsonText) as AIResponse;

    return { response, responseTimeMs, model };
}
