interface LandingUrlInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function LandingUrlInput({ value, onChange }: LandingUrlInputProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
      <label htmlFor="landing-url" className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
        Landing Page URL
        <span className="text-red-500">*</span>
      </label>
      <p id="landing-url-helper" className="mb-3 text-sm text-slate-500">
        Enter the public landing page URL to analyze.
      </p>
      <input
        id="landing-url"
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://example.com"
        aria-label="Landing Page URL"
        aria-describedby="landing-url-helper"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}
