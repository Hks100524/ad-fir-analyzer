import { NextResponse } from "next/server";

import { analyzeLandingPage } from "../../../services/geminiService";
import { parseLandingPage } from "../../../services/htmlParser";
import { fetchLandingPage } from "../../../services/landingFetcher";

type ServiceError = Error & {
  statusCode?: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const adCopy = typeof body?.adCopy === "string" ? body.adCopy.trim() : "";
    const landingUrl = typeof body?.landingUrl === "string" ? body.landingUrl.trim() : "";

    if (!adCopy || !landingUrl) {
      return NextResponse.json(
        { error: "adCopy and landingUrl are required." },
        { status: 400 }
      );
    }

    const landingPageResult = await fetchLandingPage(landingUrl);

    if (!landingPageResult.success || !landingPageResult.html) {
      const statusCode =
        landingPageResult.statusCode >= 400 ? landingPageResult.statusCode : 503;

      return NextResponse.json(
        { error: landingPageResult.error ?? "Unable to fetch landing page." },
        { status: statusCode }
      );
    }

    const parsedLandingPage = parseLandingPage(landingPageResult.html);
    const analysis = await analyzeLandingPage({
      adCopy,
      landingContent: parsedLandingPage,
    });

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const statusCode =
        typeof (error as ServiceError).statusCode === "number"
          ? (error as ServiceError).statusCode
          : 500;

      return NextResponse.json(
        {
          error:
            statusCode === 500 ? "Unable to generate analysis." : error.message,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: "Unable to generate analysis." },
      { status: 500 }
    );
  }
}
