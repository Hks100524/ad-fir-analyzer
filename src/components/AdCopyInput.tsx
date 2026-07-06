import type { ClipboardEvent } from "react";

import { getAdImageFileExtension } from "../services/adImageValidation";

interface AdCopyInputProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onPasteImage?: (file: File) => void | Promise<void>;
  value: string;
}

function createClipboardImageFile(
  event: ClipboardEvent<HTMLTextAreaElement>
) {
  const clipboardImageItem = Array.from(event.clipboardData.items).find(
    (item) => item.kind === "file" && item.type.startsWith("image/")
  );

  if (!clipboardImageItem) {
    return null;
  }

  const clipboardImage = clipboardImageItem.getAsFile();

  if (!clipboardImage) {
    return null;
  }

  const mimeType = clipboardImage.type || clipboardImageItem.type || "image/png";
  const extension = getAdImageFileExtension(mimeType);

  return new File([clipboardImage], `pasted-ad-screenshot.${extension}`, {
    type: mimeType,
  });
}

export function AdCopyInput({
  disabled = false,
  onChange,
  onPasteImage,
  value,
}: AdCopyInputProps) {
  const isEmpty = value.trim().length === 0;
  const helperText = disabled
    ? "Screenshot text is filling this field. Remove the image to edit manually."
    : isEmpty
      ? "Paste your advertisement copy below, or paste a screenshot here to extract it automatically."
      : "Your copy will be compared against the landing page.";

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    if (disabled || !onPasteImage) {
      return;
    }

    const clipboardImageFile = createClipboardImageFile(event);

    if (!clipboardImageFile) {
      return;
    }

    event.preventDefault();
    void onPasteImage(clipboardImageFile);
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
      <label htmlFor="ad-copy" className="mb-2 block text-sm font-semibold text-slate-700">
        Ad Copy
      </label>
      <p className="mb-3 text-sm text-slate-500">{helperText}</p>
      <textarea
        id="ad-copy"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onPaste={handlePaste}
        rows={8}
        maxLength={3000}
        placeholder="Example: Get 50% OFF on premium running shoes. Limited-time offer..."
        aria-label="Ad Copy"
        aria-describedby="ad-copy-helper"
        aria-invalid={Boolean(!disabled && isEmpty)}
        disabled={disabled}
        className={`min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-500"
            : "bg-white text-slate-700"
        }`}
      />
      <div id="ad-copy-helper" className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className={`transition ${isEmpty && !disabled ? "text-amber-600" : "text-slate-500"}`}>
          {disabled
            ? "Remove the image to edit this field."
            : isEmpty
              ? "Add your ad copy to continue."
              : "Your copy will be compared against the landing page."}
        </p>
        <span className="font-medium text-slate-500">{value.length} / 3000</span>
      </div>
    </div>
  );
}
