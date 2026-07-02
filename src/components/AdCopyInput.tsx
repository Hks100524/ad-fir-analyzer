interface AdCopyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdCopyInput({ value, onChange }: AdCopyInputProps) {
  const isEmpty = value.trim().length === 0;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
      <label htmlFor="ad-copy" className="mb-2 block text-sm font-semibold text-slate-700">
        Ad Copy
      </label>
      <p className="mb-3 text-sm text-slate-500">Paste your advertisement copy below.</p>
      <textarea
        id="ad-copy"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        maxLength={3000}
        placeholder="Example: Get 50% OFF on premium running shoes. Limited-time offer..."
        aria-label="Ad Copy"
        aria-describedby="ad-copy-helper"
        aria-invalid={isEmpty}
        className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
      <div id="ad-copy-helper" className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className={`transition ${isEmpty ? "text-amber-600" : "text-slate-500"}`}>
          {isEmpty ? "Add your ad copy to continue." : "Your copy will be compared against the landing page."}
        </p>
        <span className="font-medium text-slate-500">{value.length} / 3000</span>
      </div>
    </div>
  );
}
