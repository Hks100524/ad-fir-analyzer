"use client";

import type { ChangeEvent } from "react";
import { useRef } from "react";

interface AdScreenshotInputProps {
  extracting: boolean;
  file: File | null;
  previewUrl: string;
  onRemove: () => void;
  onSelectFile: (file: File) => void | Promise<void>;
}

export function AdScreenshotInput({
  extracting,
  file,
  previewUrl,
  onRemove,
  onSelectFile,
}: AdScreenshotInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.currentTarget.files?.[0];

    if (nextFile) {
      void onSelectFile(nextFile);
    }

    event.currentTarget.value = "";
  }

  function handleRemoveClick() {
    onRemove();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <label
            htmlFor="ad-screenshot"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Upload Advertisement Screenshot
          </label>
          <p className="text-sm leading-6 text-slate-500">
            PNG, JPG, JPEG, or WEBP. Paste a screenshot into the ad copy box and
            Gemini will extract the text.
          </p>
        </div>

        <label
          htmlFor="ad-screenshot"
          className={`inline-flex h-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 focus-within:outline-none focus-within:ring-4 focus-within:ring-slate-200/60 ${
            extracting ? "pointer-events-none cursor-not-allowed opacity-60" : ""
          }`}
        >
          {file ? "Replace Screenshot" : "Choose Screenshot"}
        </label>
      </div>

      <input
        ref={fileInputRef}
        id="ad-screenshot"
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        disabled={extracting}
        className="sr-only"
      />

      {file && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected advertisement screenshot preview"
              className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
              Preview
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-700">
              {file.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {extracting
                ? "Extracting ad text with Gemini Vision..."
                : "Screenshot attached. Remove it to edit the ad copy manually."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRemoveClick}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200/60"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}
