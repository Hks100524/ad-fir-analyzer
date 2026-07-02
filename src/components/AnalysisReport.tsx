import type { AnalysisResult } from "../types/analysis";
import { CategoryCard } from "./CategoryCard";
import { ScoreCard } from "./ScoreCard";

interface AnalysisReportProps {
  analysis: AnalysisResult;
}

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  const categories = [
    { title: "Persona", data: analysis.persona },
    { title: "Offer", data: analysis.offer },
    { title: "Product Framing", data: analysis.productFraming },
    { title: "Proof", data: analysis.proof },
    { title: "Objections", data: analysis.objections },
    { title: "Above-the-Fold Continuity", data: analysis.aboveTheFold },
  ];

  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 lg:p-8">
      <ScoreCard score={analysis.overallScore} />

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            score={category.data.score}
            status={category.data.status}
            reason={category.data.reason}
            suggestion={category.data.suggestion}
          />
        ))}
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Summary</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {analysis.summary || "No summary available."}
        </p>
      </div>
    </div>
  );
}
