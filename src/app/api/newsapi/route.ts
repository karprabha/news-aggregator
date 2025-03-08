import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "";
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

export async function GET(request: NextRequest) {
  // Get search parameters from the request URL
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get("endpoint") || "top-headlines"; // 'top-headlines' or 'everything'
  const keyword = searchParams.get("keyword");
  const sources = searchParams.get("sources");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  // Build params for NewsAPI
  const params = new URLSearchParams();

  if (keyword) {
    params.append("q", keyword);
  }

  if (sources) {
    params.append("sources", sources);
  } else if (endpoint === "top-headlines" && !sources) {
    // Default to some popular sources if none specified for top-headlines
    params.append("sources", "bbc-news,cnn,the-verge");
  }

  if (fromDate) {
    params.append("from", fromDate);
  }

  if (toDate) {
    params.append("to", toDate);
  }

  // Default parameters
  params.append("pageSize", "20");
  params.append("language", "en");

  if (endpoint === "everything") {
    params.append("sortBy", "publishedAt");
  }

  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/${endpoint}?${params.toString()}`,
      {
        headers: {
          "X-Api-Key": NEWS_API_KEY,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `NewsAPI error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying NewsAPI request:", error);
    return NextResponse.json(
      { error: "Failed to fetch from NewsAPI" },
      { status: 500 }
    );
  }
}
