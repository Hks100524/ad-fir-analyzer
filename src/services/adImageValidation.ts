const SUPPORTED_AD_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export const MAX_AD_IMAGE_BYTES = 10 * 1024 * 1024;

export const EMPTY_AD_IMAGE_MESSAGE =
  "The selected screenshot is empty. Please choose another image.";
export const LARGE_AD_IMAGE_MESSAGE =
  "The screenshot is too large. Please upload a smaller image.";
export const UNSUPPORTED_AD_IMAGE_MESSAGE =
  "Unsupported image type. Please upload a PNG, JPG, JPEG, or WEBP file.";

interface AdImageLike {
  name?: string;
  size?: number;
  type?: string;
}

function getFileExtension(fileName: string) {
  const lowerFileName = fileName.toLowerCase();
  const lastDotIndex = lowerFileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return lowerFileName.slice(lastDotIndex + 1);
}

export function getAdImageMimeType(file: AdImageLike) {
  const normalizedMimeType = file.type?.toLowerCase().trim() ?? "";

  if (SUPPORTED_AD_IMAGE_MIME_TYPES.has(normalizedMimeType)) {
    if (normalizedMimeType === "image/jpg") {
      return "image/jpeg";
    }

    return normalizedMimeType;
  }

  const extension = getFileExtension(file.name ?? "");

  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return "";
  }
}

export function getAdImageFileExtension(mimeType: string) {
  switch (mimeType.toLowerCase()) {
    case "image/png":
      return "png";
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/webp":
      return "webp";
    default:
      return "png";
  }
}

export function getAdImageValidationMessage(file: AdImageLike | null | undefined) {
  if (!file) {
    return "Please choose an advertisement screenshot.";
  }

  const fileSize = file.size ?? 0;

  if (fileSize <= 0) {
    return EMPTY_AD_IMAGE_MESSAGE;
  }

  if (fileSize > MAX_AD_IMAGE_BYTES) {
    return LARGE_AD_IMAGE_MESSAGE;
  }

  if (!getAdImageMimeType(file)) {
    return UNSUPPORTED_AD_IMAGE_MESSAGE;
  }

  return "";
}
