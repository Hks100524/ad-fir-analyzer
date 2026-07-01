import type { AnalysisPromptInput } from "../types/analysis";

export function buildAnalysisPrompt(input: AnalysisPromptInput): string {
  const { adCopy, landingContent } = input;

  return `
You are a Senior Conversion Rate Optimization (CRO) Consultant specializing in Ecommerce, Landing Pages, UX and Performance Marketing.

Compare the ad copy with the landing page content and evaluate how well they match.

Analyze these areas:
- Persona
- Offer
- Product Framing
- Proof
- Objections
- Above-the-Fold Continuity

For each area, score it from 0 to 100.
Explain why it received that score.
Give one practical improvement suggestion.
Also provide an overall score, a short summary, and a list of recommendations.

Ad Copy:
${adCopy}

Landing Page Content:
Title: ${landingContent.title}
Meta Description: ${landingContent.metaDescription}
Headings: ${landingContent.headings.join(", ")}
Paragraphs: ${landingContent.paragraphs.join(" | ")}
Buttons: ${landingContent.buttons.join(", ")}
Links: ${landingContent.links.join(", ")}
Images: ${landingContent.images.join(", ")}

Return ONLY valid JSON that matches the AnalysisResult structure.
Do not include any text before or after the JSON.

Use this exact structure:
{
  "overallScore": 0,
  "persona": {
    "score": 0,
    "status": "",
    "reason": "",
    "suggestion": ""
  },
  "offer": {
    "score": 0,
    "status": "",
    "reason": "",
    "suggestion": ""
  },
  "productFraming": {
    "score": 0,
    "status": "",
    "reason": "",
    "suggestion": ""
  },
  "proof": {
    "score": 0,
    "status": "",
    "reason": "",
    "suggestion": ""
  },
  "objections": {
    "score": 0,
    "status": "",
    "reason": "",
    "suggestion": ""
  },
  "aboveTheFold": {
    "score": 0,
    "status": "",
    "reason": "",
    "suggestion": ""
  },
  "summary": "",
  "recommendations": []
}
`.trim();
}
