import { NextResponse } from "next/server";

import { analyzeLandingPage } from "../../../services/geminiService";
import { parseLandingPage } from "../../../services/htmlParser";
import { fetchLandingPage } from "../../../services/landingFetcher";

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
      return NextResponse.json(
        { error: landingPageResult.error ?? "Unable to fetch landing page." },
        { status: 400 }
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
