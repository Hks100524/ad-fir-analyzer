import axios from "axios";

import type { LandingPageResponse } from "../types/landing";

export async function fetchLandingPage(url: string): Promise<LandingPageResponse> {
  try {
    const response = await axios.get<string>(url, {
      responseType: "text",
    });

    return {
      url,
      html: response.data,
      statusCode: response.status,
      success: true,
    };
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch landing page.";

    if (axios.isAxiosError(error)) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      url,
      html: "",
      statusCode: 0,
      success: false,
      error: errorMessage,
    };
  }
}
