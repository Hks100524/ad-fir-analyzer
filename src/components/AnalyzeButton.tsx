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
      aria-label="Analyze Landing Page"
      className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Analyzing...
        </span>
      ) : (
        "Analyze Landing Page"
      )}
    </button>
  );
}
