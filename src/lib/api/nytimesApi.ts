import { Article, SearchFilters } from "../types/news";


interface NYTApiResponse {
  status: string;
  copyright: string;
  response: {
    docs: NYTApiArticle[];
  };
}

interface NYTTopStoriesResponse {
  status: string;
  copyright: string;
  section: string;
  last_updated: string;
  results: NYTTopStory[];
}

interface NYTApiArticle {
  _id: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  abstract: string;
  source: string;
  headline: {
    main: string;
    print_headline?: string;
  };
  pub_date: string;
  document_type: string;
  section_name: string;
  byline: {
    original: string;
    person: Array<{
      firstname: string;
      middlename?: string;
      lastname: string;
    }>;
  };
  multimedia: Array<{
    url: string;
    type: string;
    subtype: string;
    caption: string;
    height: number;
    width: number;
  }>;
}

interface NYTTopStory {
  section: string;
  subsection: string;
  title: string;
  abstract: string;
  url: string;
  uri: string;
  byline: string;
  item_type: string;
  updated_date: string;
  created_date: string;
  published_date: string;
  material_type_facet: string;
  kicker: string;
  multimedia: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }> | null;
}

export const getTopStories = async (section = "home"): Promise<Article[]> => {
  try {
    // Use our proxy API route instead of calling NYT API directly
    const response = await fetch(
      `/api/nytimes?endpoint=topstories&section=${section}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`NYT Top Stories API error: ${response.status}`);
    }

    const data: NYTTopStoriesResponse = await response.json();

    return data.results.map(mapNYTTopStory);
  } catch (error) {
    console.error("Error fetching from NYT Top Stories API:", error);
    return [];
  }
};

export const searchNYTArticles = async (
  filters: SearchFilters
): Promise<Article[]> => {
  try {
    const params = new URLSearchParams({
      endpoint: "search",
    });

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

    // Use our proxy API route instead of calling NYT API directly
    const response = await fetch(`/api/nytimes?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`NYT Search API error: ${response.status}`);
    }

    const data: NYTApiResponse = await response.json();

    return data.response.docs.map(mapNYTApiArticle);
  } catch (error) {
    console.error("Error searching NYT API:", error);
    return [];
  }
};

// Helper function to map NYT Article Search API response to our Article interface
const mapNYTApiArticle = (article: NYTApiArticle): Article => {
  // Get the image URL from multimedia if available
  const imageUrl =
    article.multimedia.length > 0
      ? `https://www.nytimes.com/${article.multimedia[0].url}`
      : undefined;

  return {
    id: `nyt-${article._id}`,
    title: article.headline.main,
    description: article.abstract || article.snippet || "",
    content: article.lead_paragraph || "",
    url: article.web_url,
    imageUrl,
    source: "The New York Times",
    author: article.byline.original || undefined,
    category: article.section_name,
    publishedAt: article.pub_date,
  };
};

// Helper function to map NYT Top Stories API response to our Article interface
const mapNYTTopStory = (story: NYTTopStory): Article => {
  // Get the image URL from multimedia if available
  const imageUrl =
    story.multimedia && story.multimedia.length > 0
      ? story.multimedia[0].url
      : undefined;

  return {
    id: `nyt-${story.uri}`,
    title: story.title,
    description: story.abstract || "",
    content: story.abstract || "",
    url: story.url,
    imageUrl,
    source: "The New York Times",
    author: story.byline || undefined,
    category: story.section,
    publishedAt: story.published_date,
  };
};
