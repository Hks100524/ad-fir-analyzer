"use client";

import { useState } from "react";
import { AdCopyInput } from "../components/AdCopyInput";
import { AnalyzeButton } from "../components/AnalyzeButton";
import { AnalysisReport } from "../components/AnalysisReport";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { LandingUrlInput } from "../components/LandingUrlInput";
import { RecommendationList } from "../components/RecommendationList";
import type { AnalysisResult } from "../types/analysis";

const ANALYZE_REQUEST_TIMEOUT_MS = 60000;

const LANDING_PAGE_NOT_FOUND_MESSAGE =
  "The landing page could not be found (404). Please verify the URL.";
const REQUEST_TIMED_OUT_MESSAGE = "The request timed out. Please try again.";
const BLOCKED_WEBSITE_MESSAGE =
  "This website blocks automated content access. Please analyze a publicly accessible landing page.";
const GEMINI_UNAVAILABLE_MESSAGE =
  "AI analysis is temporarily unavailable.";
const GEMINI_QUOTA_MESSAGE = "Gemini quota exceeded. Please try again later.";
const LANDING_PAGE_UNAVAILABLE_MESSAGE =
  "Unable to load the landing page. Please try again.";
const UNABLE_TO_GENERATE_MESSAGE = "Unable to generate analysis.";

function getLandingUrlValidationMessage(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Please enter a landing page URL.";
  }

  try {
    const parsedUrl = new URL(trimmedValue);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return "Use a URL that starts with http:// or https://.";
    }
  } catch {
    return "Enter a valid landing page URL, like https://example.com.";
  }

  return "";
}

function getSubmissionValidationMessage(adCopy: string, landingUrl: string) {
  const trimmedAdCopy = adCopy.trim();
  const trimmedLandingUrl = landingUrl.trim();

  if (!trimmedAdCopy && !trimmedLandingUrl) {
    return "Please add your ad copy and landing page URL before analyzing.";
  }

  if (!trimmedAdCopy) {
    return "Please paste the ad copy you want to compare.";
  }

  if (!trimmedLandingUrl) {
    return "Please enter a landing page URL.";
  }

  return getLandingUrlValidationMessage(trimmedLandingUrl);
}

function getFriendlyApiError(status: number, apiError?: unknown) {
  const message = typeof apiError === "string" ? apiError.toLowerCase() : "";

  if (status === 400) {
    return "The information you entered looks incomplete. Please check the ad copy and landing page URL.";
  }

  if (status === 404) {
    return LANDING_PAGE_NOT_FOUND_MESSAGE;
  }

  if (status === 403) {
    return BLOCKED_WEBSITE_MESSAGE;
  }

  if (status === 429) {
    return GEMINI_QUOTA_MESSAGE;
  }

  if (status === 504 || message.includes("timed out")) {
    return REQUEST_TIMED_OUT_MESSAGE;
  }

  if (status === 503) {
    if (message.includes("landing page")) {
      return LANDING_PAGE_UNAVAILABLE_MESSAGE;
    }

    return GEMINI_UNAVAILABLE_MESSAGE;
  }

  if (status === 502) {
    return UNABLE_TO_GENERATE_MESSAGE;
  }

  if (status >= 500) {
    return UNABLE_TO_GENERATE_MESSAGE;
  }

  return UNABLE_TO_GENERATE_MESSAGE;
}

function getNetworkErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const lowerMessage = error.message.toLowerCase();

    if (
      error.message === LANDING_PAGE_NOT_FOUND_MESSAGE ||
      error.message === REQUEST_TIMED_OUT_MESSAGE ||
      error.message === BLOCKED_WEBSITE_MESSAGE ||
      error.message === GEMINI_UNAVAILABLE_MESSAGE ||
      error.message === GEMINI_QUOTA_MESSAGE ||
      error.message === LANDING_PAGE_UNAVAILABLE_MESSAGE ||
      error.message === UNABLE_TO_GENERATE_MESSAGE
    ) {
      return error.message;
    }

    if (error.name === "AbortError" || lowerMessage.includes("aborted")) {
      return REQUEST_TIMED_OUT_MESSAGE;
    }

    if (lowerMessage.includes("timeout")) {
      return REQUEST_TIMED_OUT_MESSAGE;
    }

    if (
      lowerMessage.includes("failed to fetch") ||
      lowerMessage.includes("networkerror") ||
      lowerMessage.includes("network request failed")
    ) {
      return "We couldn't reach the analyzer service. Check your connection and try again.";
    }
  }

  return UNABLE_TO_GENERATE_MESSAGE;
}

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AnalysisResult;

  return (
    typeof candidate.overallScore === "number" &&
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.recommendations)
  );
}

export default function Page() {
  const [adCopy, setAdCopy] = useState("");
  const [landingUrl, setLandingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAnalyze() {
    const validationMessage = getSubmissionValidationMessage(adCopy, landingUrl);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setErrorMessage("");
    setLoading(true);
    setAnalysis(null);
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => {
      abortController.abort();
    }, ANALYZE_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adCopy,
          landingUrl,
        }),
        signal: abortController.signal,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getFriendlyApiError(response.status, payload && typeof payload === "object" ? (payload as { error?: unknown }).error : undefined)
        );
      }

      if (!isAnalysisResult(payload)) {
        throw new Error("We received an unexpected analysis response. Please try again.");
      }

      setAnalysis(payload);
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorMessage(getNetworkErrorMessage(error));
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8" aria-busy={loading}>
      <Header />

      <Hero />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <fieldset disabled={loading} className="flex min-w-0 flex-col gap-4 border-0 p-0">
          <AdCopyInput
            value={adCopy}
            onChange={(nextValue) => {
              setAdCopy(nextValue);
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
          />

          <LandingUrlInput
            value={landingUrl}
            onChange={(nextValue) => {
              setLandingUrl(nextValue);
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
          />

          <AnalyzeButton
            loading={loading}
            onClick={handleAnalyze}
          />
        </fieldset>

        {(loading || errorMessage) && (
          <div
            role={loading ? "status" : "alert"}
            aria-live={loading ? "polite" : "assertive"}
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
              loading
                ? "border-slate-200 bg-slate-50 text-slate-600"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {loading
              ? "Fetching the landing page and generating your analysis. This may take a few seconds."
              : errorMessage}
          </div>
        )}
      </div>

      {analysis && (
        <div className="flex flex-col gap-6">
          <AnalysisReport analysis={analysis} />
          <RecommendationList recommendations={analysis.recommendations} />
        </div>
      )}
    </main>
  );
}
