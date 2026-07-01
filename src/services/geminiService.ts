import { buildAnalysisPrompt } from "../prompts/analyzerPrompt";
import type { AnalysisPromptInput, AnalysisResult } from "../types/analysis";

export async function analyzeLandingPage(input: AnalysisPromptInput): Promise<AnalysisResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const prompt = buildAnalysisPrompt(input);
    // @ts-ignore
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text?.trim() ?? "";

    if (!rawText) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanedText) as AnalysisResult;
      return parsed;
    } catch {
      throw new Error("Gemini returned invalid JSON for the landing page analysis.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to analyze landing page with Gemini.");
  }
}
