import { Lightbulb } from "lucide-react";

interface RecommendationListProps {
  recommendations: string[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        Recommended Improvements
      </h2>

      {recommendations.length === 0 ? (
        <p className="mt-4 text-sm leading-7 text-slate-600">No recommendations available.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {recommendations.map((recommendation, index) => (
            <li
              key={`${recommendation}-${index}`}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-700">
                <Lightbulb className="h-4 w-4" />
              </div>
              <p className="text-sm leading-6 text-slate-700">{recommendation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

