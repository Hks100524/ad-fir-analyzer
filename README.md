# Ad-to-Landing Page Fit Analyzer

An AI-powered application that evaluates how well an ad creative aligns with its destination landing page. It analyzes the message match across persona, offer, product framing, proof, objections, and above-the-fold continuity, then turns the findings into a structured fit score and actionable recommendations.

## Overview

Ad-to-Landing Page Fit Analyzer helps marketers, founders, and growth teams quickly understand whether their ad copy and landing page are telling the same story. The app fetches the destination page, parses the HTML into structured content, sends the ad copy plus landing page context to Gemini, and returns a clear report with scores, summaries, and next-step guidance.

## Features

- AI-powered ad analysis
- Landing page fetching
- HTML parsing
- Persona analysis
- Offer analysis
- Product framing analysis
- Proof analysis
- Objection analysis
- Above-the-fold continuity analysis
- Overall fit score
- Executive summary
- Actionable recommendations
- Responsive UI

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Tailwind CSS 4, Lucide React |
| Backend | Next.js Route Handlers |
| AI | Google Gemini 2.5 Flash via `@google/genai` |
| Parsing | Axios, Cheerio |
| Language | TypeScript |
| Framework | Next.js 16 (App Router) |

## Architecture

The application follows a simple server-side analysis pipeline:

```text
Ad Copy
|
v
Landing URL
|
v
Fetch HTML
|
v
Parse HTML
|
v
Gemini Analysis
|
v
Structured JSON
|
v
Interactive Report
```

The user submits ad copy and a landing page URL, the server fetches the page HTML, extracts key page signals, and Gemini converts that context into a structured JSON report rendered in the UI.

## Folder Structure

- `src/app` - App Router pages, global styles, layout, and API routes
- `src/components` - Reusable UI components for inputs, scores, reports, and recommendations
- `src/services` - Landing page fetching, HTML parsing, and Gemini integration
- `src/prompts` - Prompt construction for the AI analysis pipeline
- `src/types` - Shared TypeScript types for landing pages and analysis results
- `public` - Static assets used by the application

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file in the project root and add your Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Screenshots

Add project screenshots here when available.

![Landing page placeholder](./screenshots/landing-page.png)

![Analysis report placeholder](./screenshots/analysis-report.png)

## Future Improvements

- Multiple Ad Comparison
- Ad Clustering
- Landing Page Section Suggestions
- PDF Export
