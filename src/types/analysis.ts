import type { ParsedLandingPage } from "./parsedLanding";

export interface AnalysisCategory {
  score: number;
  status: string;
  reason: string;
  suggestion: string;
}

export interface AnalysisResult {
  overallScore: number;
  persona: AnalysisCategory;
  offer: AnalysisCategory;
  productFraming: AnalysisCategory;
  proof: AnalysisCategory;
  objections: AnalysisCategory;
  aboveTheFold: AnalysisCategory;
  summary: string;
  recommendations: string[];
}

export interface AnalysisPromptInput {
  adCopy: string;
  landingContent: ParsedLandingPage;
}
