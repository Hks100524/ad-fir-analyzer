import axios from "axios";

import type { LandingPageResponse } from "../types/landing";

const LANDING_PAGE_REQUEST_TIMEOUT_MS = 30000;

const BLOCKED_RESPONSE_STATUSES = new Set([401, 403, 429, 451]);

const BLOCKED_PAGE_PATTERNS = [
  /access denied/i,
  /request blocked/i,
  /cloudflare/i,
  /captcha/i,
  /verify you are human/i,
  /robot check/i,
  /bot detection/i,
  /suspicious activity/i,
  /security check/i,
  /enable javascript/i,
  /please turn on javascript/i,
  /unusual traffic/i,
];

function isBlockedPageContent(html: string) {
  return BLOCKED_PAGE_PATTERNS.some((pattern) => pattern.test(html));
}

function createFailureResponse(
  url: string,
  statusCode: number,
  error: string
): LandingPageResponse {
  return {
    url,
    html: "",
    statusCode,
    success: false,
    error,
  };
}

export async function fetchLandingPage(url: string): Promise<LandingPageResponse> {
  try {
    const response = await axios.get<string>(url, {
      responseType: "text",
      timeout: LANDING_PAGE_REQUEST_TIMEOUT_MS,
      validateStatus: () => true,
    });

    const html = typeof response.data === "string" ? response.data : "";
    const statusCode = response.status;

    if (statusCode === 404) {
      return createFailureResponse(
        url,
        404,
        "The landing page could not be found (404). Please verify the URL."
      );
    }

    if (BLOCKED_RESPONSE_STATUSES.has(statusCode) || isBlockedPageContent(html)) {
      return createFailureResponse(
        url,
        403,
        "This website blocks automated content access. Please analyze a publicly accessible landing page."
      );
    }

    if (statusCode >= 500) {
      return createFailureResponse(
        url,
        503,
        "Unable to load the landing page. Please try again."
      );
    }

    return {
      url,
      html,
      statusCode,
      success: true,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const lowerMessage = error.message.toLowerCase();
      const responseStatus = error.response?.status;

      if (lowerMessage.includes("timeout") || error.code === "ECONNABORTED") {
        return createFailureResponse(
          url,
          504,
          "The request timed out. Please try again."
        );
      }

      if (responseStatus === 404) {
        return createFailureResponse(
          url,
          404,
          "The landing page could not be found (404). Please verify the URL."
        );
      }

      if (responseStatus && BLOCKED_RESPONSE_STATUSES.has(responseStatus)) {
        return createFailureResponse(
          url,
          403,
          "This website blocks automated content access. Please analyze a publicly accessible landing page."
        );
      }

      if (responseStatus && responseStatus >= 500) {
        return createFailureResponse(
          url,
          503,
          "Unable to load the landing page. Please try again."
        );
      }
    }

    return createFailureResponse(
      url,
      503,
      "Unable to load the landing page. Please try again."
    );
  }
}
