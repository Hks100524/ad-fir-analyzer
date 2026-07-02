import { buildAnalysisPrompt } from "../prompts/analyzerPrompt";
import type { AnalysisPromptInput, AnalysisResult } from "../types/analysis";

type GeminiServiceError = Error & {
  statusCode: number;
};

function createGeminiServiceError(message: string, statusCode: number): GeminiServiceError {
  const error = new Error(message) as GeminiServiceError;
  error.statusCode = statusCode;
  return error;
}

function isGeminiServiceError(error: unknown): error is GeminiServiceError {
  return (
    error instanceof Error &&
    typeof (error as { statusCode?: unknown }).statusCode === "number"
  );
}

function normalizeGeminiError(error: unknown): GeminiServiceError {
  if (isGeminiServiceError(error)) {
    return error;
  }

  const lowerMessage = error instanceof Error ? error.message.toLowerCase() : "";
  const status = typeof error === "object" && error !== null && "status" in error
    ? (error as { status?: number }).status
    : undefined;

  if (
    status === 429 ||
    lowerMessage.includes("quota exceeded") ||
    lowerMessage.includes("resource exhausted") ||
    lowerMessage.includes("rate limit")
  ) {
    return createGeminiServiceError(
      "Gemini quota exceeded. Please try again later.",
      429
    );
  }

  if (
    status === 401 ||
    status === 403 ||
    lowerMessage.includes("api key") ||
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("forbidden")
  ) {
    return createGeminiServiceError(
      "AI analysis is temporarily unavailable.",
      503
    );
  }

  if (
    status === 504 ||
    lowerMessage.includes("timeout") ||
    lowerMessage.includes("timed out") ||
    lowerMessage.includes("aborted")
  ) {
    return createGeminiServiceError(
      "The request timed out. Please try again.",
      504
    );
  }

  if (
    status === 503 ||
    lowerMessage.includes("unavailable") ||
    lowerMessage.includes("network") ||
    lowerMessage.includes("failed to fetch") ||
    lowerMessage.includes("service error")
  ) {
    return createGeminiServiceError(
      "AI analysis is temporarily unavailable.",
      503
    );
  }

  if (
    status === 400 ||
    lowerMessage.includes("empty response") ||
    lowerMessage.includes("invalid json") ||
    lowerMessage.includes("parse")
  ) {
    return createGeminiServiceError("Unable to generate analysis.", 502);
  }

  return createGeminiServiceError("Unable to generate analysis.", 502);
}

export async function analyzeLandingPage(input: AnalysisPromptInput): Promise<AnalysisResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw createGeminiServiceError(
        "AI analysis is temporarily unavailable.",
        503
      );
    }

    const prompt = buildAnalysisPrompt(input);
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        httpOptions: {
          timeout: 30000,
        },
      },
    });

    const rawText = response.text?.trim() ?? "";

    if (!rawText) {
      throw createGeminiServiceError("Unable to generate analysis.", 502);
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
      throw createGeminiServiceError("Unable to generate analysis.", 502);
    }
  } catch (error) {
    throw normalizeGeminiError(error);
  }
}
