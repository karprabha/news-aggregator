import { Article, SearchFilters } from "../types/news";

interface GuardianApiResponse {
  response: {
    status: string;
    total: number;
    results: GuardianApiArticle[];
  };
}

interface GuardianApiArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    headline?: string;
    trailText?: string;
    byline?: string;
    thumbnail?: string;
    body?: string;
  };
  tags: Array<{
    id: string;
    type: string;
    webTitle: string;
  }>;
}

export const getLatestNews = async (
  filters?: SearchFilters
): Promise<Article[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.keyword) {
      params.append("keyword", filters.keyword);
    }

    if (filters?.fromDate) {
      params.append("fromDate", filters.fromDate);
    }

    if (filters?.toDate) {
      params.append("toDate", filters.toDate);
    }

    if (filters?.categories && filters.categories.length > 0) {
      params.append("categories", filters.categories.join(","));
    }

    // Use our proxy API route instead of calling Guardian directly
    const response = await fetch(`/api/guardian?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }

    const data: GuardianApiResponse = await response.json();

    return data.response.results.map(mapGuardianApiArticle);
  } catch (error) {
    console.error("Error fetching from Guardian API:", error);
    return [];
  }
};

export const searchGuardianArticles = async (
  filters: SearchFilters
): Promise<Article[]> => {
  try {
    const params = new URLSearchParams();

    if (filters.keyword) {
      params.append("keyword", filters.keyword);
    }

    if (filters.fromDate) {
      params.append("fromDate", filters.fromDate);
    }

    if (filters.toDate) {
      params.append("toDate", filters.toDate);
    }

    if (filters.categories && filters.categories.length > 0) {
      params.append("categories", filters.categories.join(","));
    }

    // Use our proxy API route instead of calling Guardian directly
    const response = await fetch(`/api/guardian?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }

    const data: GuardianApiResponse = await response.json();

    return data.response.results.map(mapGuardianApiArticle);
  } catch (error) {
    console.error("Error searching Guardian API:", error);
    return [];
  }
};

// Helper function to map Guardian API response to our Article interface
const mapGuardianApiArticle = (article: GuardianApiArticle): Article => {
  // Extract author or use section name if author not available
  const author = article.fields?.byline || article.sectionName;

  // Extract category from section
  const category = article.sectionId;

  return {
    id: `guardian-${article.id}`,
    title: article.fields?.headline || article.webTitle,
    description: article.fields?.trailText || "",
    content: article.fields?.body || "",
    url: article.webUrl,
    imageUrl: article.fields?.thumbnail,
    source: "The Guardian",
    author,
    category,
    publishedAt: article.webPublicationDate,
  };
};
