import { Article, SearchFilters } from "../types/news";


interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export const getTopHeadlines = async (
  filters?: SearchFilters
): Promise<Article[]> => {
  try {
    const params = new URLSearchParams({
      endpoint: "top-headlines",
    });

    if (filters?.keyword) {
      params.append("keyword", filters.keyword);
    }

    if (filters?.sources && filters.sources.length > 0) {
      params.append("sources", filters.sources.join(","));
    }

    if (filters?.fromDate) {
      params.append("fromDate", filters.fromDate);
    }

    if (filters?.toDate) {
      params.append("toDate", filters.toDate);
    }

    // Use our proxy API route instead of calling NewsAPI directly
    const response = await fetch(`/api/newsapi?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();

    return data.articles.map(mapNewsApiArticle);
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return [];
  }
};

export const searchArticles = async (
  filters: SearchFilters
): Promise<Article[]> => {
  try {
    const params = new URLSearchParams({
      endpoint: "everything",
    });

    if (filters.keyword) {
      params.append("keyword", filters.keyword);
    } else {
      params.append("keyword", "technology"); // Default search term
    }

    if (filters.fromDate) {
      params.append("fromDate", filters.fromDate);
    }

    if (filters.toDate) {
      params.append("toDate", filters.toDate);
    }

    if (filters.sources && filters.sources.length > 0) {
      params.append("sources", filters.sources.join(","));
    }

    // Use our proxy API route instead of calling NewsAPI directly
    const response = await fetch(`/api/newsapi?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();

    return data.articles.map(mapNewsApiArticle);
  } catch (error) {
    console.error("Error searching NewsAPI:", error);
    return [];
  }
};

// Helper function to map NewsAPI response to our Article interface
const mapNewsApiArticle = (article: NewsApiArticle): Article => {
  return {
    id: `newsapi-${article.url}`,
    title: article.title,
    description: article.description || "",
    content: article.content || "",
    url: article.url,
    imageUrl: article.urlToImage || undefined,
    source: article.source.name,
    author: article.author || undefined,
    publishedAt: article.publishedAt,
    category: "general", // NewsAPI doesn't provide categories in their response
  };
};
