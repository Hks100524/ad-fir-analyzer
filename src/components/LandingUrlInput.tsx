"use client";

import { useState } from "react";

interface LandingUrlInputProps {
  value: string;
  onChange: (value: string) => void;
}

function getLandingUrlError(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Please enter a landing page URL.";
  }

  try {
    const parsedUrl = new URL(trimmedValue);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return "Use a URL that starts with http:// or https://.";
    }
  } catch {
    return "Enter a valid landing page URL, like https://example.com.";
  }

  return "";
}

export function LandingUrlInput({ value, onChange }: LandingUrlInputProps) {
  const [hasBlurred, setHasBlurred] = useState(false);
  const trimmedValue = value.trim();
  const errorMessage = trimmedValue || hasBlurred ? getLandingUrlError(value) : "";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm transition duration-200 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
        <label htmlFor="landing-url">Landing Page URL</label>
        <span className="text-red-500">*</span>
      </div>

      <p id="landing-url-helper" className="mb-3 text-sm leading-6 text-slate-500">
        Enter the public landing page URL you want to analyze.
      </p>

      <input
        id="landing-url"
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => setHasBlurred(true)}
        placeholder="https://example.com"
        autoComplete="url"
        autoCapitalize="none"
        spellCheck={false}
        inputMode="url"
        required
        aria-label="Landing Page URL"
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? "landing-url-helper landing-url-error" : "landing-url-helper"}
        aria-errormessage={errorMessage ? "landing-url-error" : undefined}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
      />

      <p
        id="landing-url-error"
        className="mt-3 min-h-5 text-sm leading-6 text-rose-600 transition"
        aria-live="polite"
      >
        {errorMessage}
      </p>
    </div>
  );
}
