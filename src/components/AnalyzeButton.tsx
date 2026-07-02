interface AnalyzeButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function AnalyzeButton({ loading, onClick }: AnalyzeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      aria-label={loading ? "Analyzing landing page" : "Analyze landing page"}
      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_16px_35px_rgba(15,23,42,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-slate-300 sm:w-auto sm:min-w-52"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-[3px] border-white/30 border-t-white"
            aria-hidden="true"
          />
          <span>Analyzing landing page...</span>
        </span>
      ) : (
        <span className="transition-transform duration-200 group-hover:-translate-y-px">
          Analyze Landing Page
        </span>
      )}
    </button>
  );
}
