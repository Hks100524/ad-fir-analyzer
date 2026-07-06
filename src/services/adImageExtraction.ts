import { Buffer } from "node:buffer";

import {
  LARGE_AD_IMAGE_MESSAGE,
  getAdImageMimeType,
  getAdImageValidationMessage,
} from "./adImageValidation";

type AdImageExtractionError = Error & {
  statusCode: number;
};

const IMAGE_EXTRACTION_TIMEOUT_MS = 30000;

const AD_IMAGE_EXTRACTION_PROMPT = `
Extract only the advertisement copy from this screenshot.

Ignore browser UI, logos unless they are part of the advertisement, navigation, footer content, and unrelated decorations.

Return plain text only.
No markdown.
No JSON.
No bullets.
No commentary.
`.trim();

function createAdImageExtractionError(
  message: string,
  statusCode: number
): AdImageExtractionError {
  const error = new Error(message) as AdImageExtractionError;
  error.statusCode = statusCode;
  return error;
}

function isAdImageExtractionError(
  error: unknown
): error is AdImageExtractionError {
  return (
    error instanceof Error &&
    typeof (error as { statusCode?: unknown }).statusCode === "number"
  );
}

function normalizeGeminiError(error: unknown): AdImageExtractionError {
  if (isAdImageExtractionError(error)) {
    return error;
  }

  const lowerMessage = error instanceof Error ? error.message.toLowerCase() : "";
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: number }).status
      : undefined;

  if (
    status === 429 ||
    lowerMessage.includes("quota exceeded") ||
    lowerMessage.includes("resource exhausted") ||
    lowerMessage.includes("rate limit")
  ) {
    return createAdImageExtractionError(
      "Screenshot extraction quota exceeded. Please try again later.",
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
    return createAdImageExtractionError(
      "Screenshot extraction is temporarily unavailable.",
      503
    );
  }

  if (
    status === 504 ||
    lowerMessage.includes("timeout") ||
    lowerMessage.includes("timed out") ||
    lowerMessage.includes("aborted")
  ) {
    return createAdImageExtractionError(
      "Screenshot extraction timed out. Please try again.",
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
    return createAdImageExtractionError(
      "Screenshot extraction is temporarily unavailable.",
      503
    );
  }

  if (
    status === 400 ||
    lowerMessage.includes("empty response") ||
    lowerMessage.includes("invalid json") ||
    lowerMessage.includes("parse")
  ) {
    return createAdImageExtractionError(
      "Unable to extract text from the screenshot.",
      502
    );
  }

  return createAdImageExtractionError(
    "Unable to extract text from the screenshot.",
    502
  );
}

export async function extractAdvertisementTextFromImage(file: File) {
  try {
    const validationMessage = getAdImageValidationMessage(file);

    if (validationMessage) {
      const statusCode =
        validationMessage === LARGE_AD_IMAGE_MESSAGE ? 413 : 400;

      throw createAdImageExtractionError(validationMessage, statusCode);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw createAdImageExtractionError(
        "Screenshot extraction is temporarily unavailable.",
        503
      );
    }

    const mimeType = getAdImageMimeType(file);

    if (!mimeType) {
      throw createAdImageExtractionError(
        "Unsupported image type. Please upload a PNG, JPG, JPEG, or WEBP file.",
        400
      );
    }

    const { GoogleGenAI, createPartFromBase64, createPartFromText } =
      await import("@google/genai");

    const imageBytes = Buffer.from(await file.arrayBuffer()).toString("base64");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            createPartFromText(AD_IMAGE_EXTRACTION_PROMPT),
            createPartFromBase64(imageBytes, mimeType),
          ],
        },
      ],
      config: {
        httpOptions: {
          timeout: IMAGE_EXTRACTION_TIMEOUT_MS,
        },
        responseMimeType: "text/plain",
      },
    });

    const rawText = response.text?.trim() ?? "";

    const cleanedText = rawText
      .replace(/^```(?:text)?\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    if (!cleanedText) {
      throw createAdImageExtractionError(
        "We couldn't find ad copy in that screenshot. Please try a clearer image.",
        422
      );
    }

    return cleanedText;
  } catch (error) {
    throw normalizeGeminiError(error);
  }
}
