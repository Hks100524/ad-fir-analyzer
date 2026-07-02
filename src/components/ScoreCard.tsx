interface ScoreCardProps {
  score: number;
}

function getStatus(score: number) {
  if (score >= 90) return "Excellent Match";
  if (score >= 75) return "Good Match";
  if (score >= 50) return "Needs Improvement";
  return "Poor Match";
}

function getTone(score: number) {
  if (score >= 90) {
    return {
      card: "from-emerald-50 via-white to-emerald-50",
      text: "text-emerald-700",
      chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
      badge: "border-emerald-200 bg-white/80 text-emerald-700",
    };
  }

  if (score >= 75) {
    return {
      card: "from-sky-50 via-white to-sky-50",
      text: "text-sky-700",
      chip: "border-sky-200 bg-sky-50 text-sky-700",
      badge: "border-sky-200 bg-white/80 text-sky-700",
    };
  }

  if (score >= 50) {
    return {
      card: "from-amber-50 via-white to-amber-50",
      text: "text-amber-700",
      chip: "border-amber-200 bg-amber-50 text-amber-700",
      badge: "border-amber-200 bg-white/80 text-amber-700",
    };
  }

  return {
    card: "from-rose-50 via-white to-rose-50",
    text: "text-rose-700",
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    badge: "border-rose-200 bg-white/80 text-rose-700",
  };
}

export function ScoreCard({ score }: ScoreCardProps) {
  const tone = getTone(score);

  return (
    <div className={`rounded-[2rem] border border-slate-200 bg-gradient-to-br ${tone.card} p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5 sm:p-8`}>
      <div className="flex flex-col items-center text-center">
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${tone.badge}`}>
          Overall Fit Score
        </span>
        <div className="mt-5 flex items-end justify-center gap-2">
          <div className={`text-6xl font-semibold tracking-tight sm:text-7xl ${tone.text}`}>
            {score}
          </div>
          <span className="pb-2 text-2xl font-medium text-slate-500 sm:text-3xl">/ 100</span>
        </div>
        <div className={`mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${tone.chip}`}>
          {getStatus(score)}
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
          This score reflects how closely the ad promise matches the landing experience.
        </p>
      </div>
    </div>
  );
}
