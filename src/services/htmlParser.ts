import * as cheerio from "cheerio";

import type { ParsedLandingPage } from "../types/parsedLanding";

export function parseLandingPage(html: string): ParsedLandingPage {
  try {
    const $ = cheerio.load(html);

    $("script, style, noscript").remove();

    const title = $("title").first().text().trim();
    const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? "";

    const headings = $("h1, h2, h3")
      .map((_, element) => $(element).text().trim())
      .get()
      .filter(Boolean);

    const paragraphs = $("p")
      .map((_, element) => $(element).text().trim())
      .get()
      .filter(Boolean);

    const buttons = $("button, a")
      .map((_, element) => $(element).text().trim())
      .get()
      .filter(Boolean);

    const links = $("a")
      .map((_, element) => $(element).attr("href")?.trim())
      .get()
      .filter((value): value is string => Boolean(value));

    const images = $("img")
      .map((_, element) => $(element).attr("alt")?.trim())
      .get()
      .filter(Boolean);

    return {
      title,
      metaDescription,
      headings,
      paragraphs,
      buttons,
      links,
      images,
    };
  } catch (error) {
    console.error("Failed to parse landing page HTML.", error);

    return {
      title: "",
      metaDescription: "",
      headings: [],
      paragraphs: [],
      buttons: [],
      links: [],
      images: [],
    };
  }
}
