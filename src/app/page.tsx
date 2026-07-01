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

export default function Page() {
  const [adCopy, setAdCopy] = useState("");
  const [landingUrl, setLandingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  async function handleAnalyze() {
    if (!adCopy.trim() || !landingUrl.trim()) {
      return;
    }

    setAnalysis(null);
    setLoading(true);

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
      });

      if (!response.ok) {
        throw new Error("Failed to analyze landing page.");
      }

      const data: AnalysisResult = await response.json();

      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Header />

      <Hero />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <AdCopyInput
            value={adCopy}
            onChange={setAdCopy}
          />

          <LandingUrlInput
            value={landingUrl}
            onChange={setLandingUrl}
          />

          <AnalyzeButton
            loading={loading}
            onClick={handleAnalyze}
          />
        </div>
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