import { NextRequest, NextResponse } from "next/server";

const NYT_API_KEY = process.env.NYT_API_KEY || "";
const NYT_API_BASE_URL = "https://api.nytimes.com/svc";

export async function GET(request: NextRequest) {
  // Get search parameters from the request URL
  const searchParams = request.nextUrl.searchParams;
  const section = searchParams.get("section") || "home";
  const keyword = searchParams.get("keyword");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const categories = searchParams.get("categories");
  const endpoint = searchParams.get("endpoint") || "topstories"; // 'topstories' or 'search'

  try {
    let url;
    let apiParams;

    if (endpoint === "search") {
      // Handle article search endpoint
      apiParams = new URLSearchParams({
        "api-key": NYT_API_KEY,
      });

      if (keyword) {
        apiParams.append("q", keyword);
      }

      if (fromDate) {
        apiParams.append("begin_date", fromDate.replace(/-/g, ""));
      }

      if (toDate) {
        apiParams.append("end_date", toDate.replace(/-/g, ""));
      }

      if (categories) {
        const fqCategories = categories
          .split(",")
          .map((category) => `news_desk:(${category})`)
          .join(" OR ");
        apiParams.append("fq", fqCategories);
      }

      apiParams.append("sort", "newest");
      url = `${NYT_API_BASE_URL}/search/v2/articlesearch.json?${apiParams.toString()}`;
    } else {
      // Handle top stories endpoint
      url = `${NYT_API_BASE_URL}/topstories/v2/${section}.json?api-key=${NYT_API_KEY}`;
    }

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { error: `NYT API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying NYT API request:", error);
    return NextResponse.json(
      { error: "Failed to fetch from NYT API" },
      { status: 500 }
    );
  }
}
