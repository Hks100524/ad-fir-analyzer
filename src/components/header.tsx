export function Header() {
  return (
    <header className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white/90 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-sm ring-1 ring-slate-900/10">
          ✦
        </div>
        <span className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
          Ad Fit Analyzer
        </span>
      </div>

      <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
        AI Powered
      </span>
    </header>
  );
}
