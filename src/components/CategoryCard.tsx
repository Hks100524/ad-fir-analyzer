interface CategoryCardProps {
  title: string;
  score: number;
  status: string;
  reason: string;
  suggestion: string;
}

function getScoreBadgeClasses(score: number) {
  if (score >= 90) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (score >= 75) return "border-sky-200 bg-sky-50 text-sky-700";
  if (score >= 50) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function getStatusBadgeClasses(status: string) {
  if (status.toLowerCase().includes("excellent")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status.toLowerCase().includes("good")) return "border-sky-200 bg-sky-50 text-sky-700";
  if (status.toLowerCase().includes("average")) return "border-amber-200 bg-amber-50 text-amber-700";
  if (status.toLowerCase().includes("poor")) return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function CategoryCard({ title, score, status, reason, suggestion }: CategoryCardProps) {
  const statusClasses = getStatusBadgeClasses(status);
  const scoreClasses = getScoreBadgeClasses(score);

  return (
    <div className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
          <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses}`}>
            {status}
          </span>
        </div>
        <div className={`rounded-full border px-3 py-1 text-sm font-semibold ${scoreClasses}`}>
          {score} / 100
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">Reason</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{reason}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
          <p className="text-sm font-semibold text-slate-700">Suggestion</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{suggestion}</p>
        </div>
      </div>
    </div>
  );
}
