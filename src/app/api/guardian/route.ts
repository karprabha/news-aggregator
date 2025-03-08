import { NextRequest, NextResponse } from "next/server";

const GUARDIAN_API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY || "";
const GUARDIAN_API_BASE_URL = "https://content.guardianapis.com";

export async function GET(request: NextRequest) {
  // Get search parameters from the request URL
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get("keyword");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const categories = searchParams.get("categories");

  // Build params for the Guardian API
  const params = new URLSearchParams({
    "api-key": GUARDIAN_API_KEY,
    "show-fields": "headline,trailText,byline,thumbnail,body",
    "show-tags": "keyword",
    "page-size": "20",
  });

  if (keyword) {
    params.append("q", keyword);
  }

  if (fromDate) {
    params.append("from-date", fromDate);
  }

  if (toDate) {
    params.append("to-date", toDate);
  }

  if (categories) {
    // In Guardian API, sections can be used as categories
    params.append("section", categories.replace(/,/g, "|"));
  }

  try {
    const response = await fetch(
      `${GUARDIAN_API_BASE_URL}/search?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Guardian API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying Guardian API request:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Guardian API" },
      { status: 500 }
    );
  }
}
