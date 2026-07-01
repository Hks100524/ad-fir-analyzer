interface ScoreCardProps {
  score: number;
}

function getStatus(score: number) {
  if (score >= 90) return "Excellent Match";
  if (score >= 75) return "Good Match";
  if (score >= 50) return "Needs Improvement";
  return "Poor Match";
}

export function ScoreCard({ score }: ScoreCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Overall Fit Score
        </p>
        <div className="mt-4 text-6xl font-semibold tracking-tight text-slate-900 sm:text-7xl">
          {score} <span className="text-2xl text-slate-500 sm:text-3xl">/ 100</span>
        </div>
        <div className="mt-4 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          {getStatus(score)}
        </div>
      </div>
    </div>
  );
}
