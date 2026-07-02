export function Hero() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-10 text-center shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
          AI-Powered Landing Page Analysis
        </span>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Find Ad & Landing Page Mismatches Before Your Customers Do
        </h1>

        <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Compare your ad copy with a landing page using AI to detect mismatches in persona, offer, product framing, proof, objections, and above-the-fold continuity.
        </p>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
            AI Analysis
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
            Landing Page Audit
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
            Actionable Insights
          </span>
        </div>
      </div>
    </section>
  );
}
