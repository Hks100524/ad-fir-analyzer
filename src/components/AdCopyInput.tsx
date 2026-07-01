interface AdCopyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdCopyInput({ value, onChange }: AdCopyInputProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
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
        className="min-h-36 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
      <div id="ad-copy-helper" className="mt-2 flex justify-end text-sm text-slate-500">
        {value.length} / 3000
      </div>
    </div>
  );
}
