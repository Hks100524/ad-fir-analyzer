export function Header() {
  return (
    <header className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          ✦
        </div>
        <span className="text-base font-semibold tracking-tight text-slate-900">
          Ad Fit Analyzer
        </span>
      </div>

      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
        AI Powered
      </span>
    </header>
  );
}
