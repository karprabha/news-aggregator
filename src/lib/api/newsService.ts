import {
  Article,
  SearchFilters,
  NewsSource,
  NewsCategory,
  UserPreferences,
} from "../types/news";
import { getTopHeadlines, searchArticles as searchNewsApi } from "./newsApi";
import { getLatestNews, searchGuardianArticles } from "./guardianApi";
import { getTopStories, searchNYTArticles } from "./nytimesApi";

// Default news sources
export const defaultSources: NewsSource[] = [
  { id: "newsapi", name: "News API", enabled: true },
  { id: "guardian", name: "The Guardian", enabled: true },
  { id: "nytimes", name: "The New York Times", enabled: true },
];

// Default news categories
export const defaultCategories: NewsCategory[] = [
  { id: "general", name: "General", enabled: true },
  { id: "business", name: "Business", enabled: true },
  { id: "technology", name: "Technology", enabled: true },
  { id: "entertainment", name: "Entertainment", enabled: true },
  { id: "sports", name: "Sports", enabled: true },
  { id: "science", name: "Science", enabled: true },
  { id: "health", name: "Health", enabled: true },
  { id: "politics", name: "Politics", enabled: true },
];

// Function to get top headlines from all enabled sources
export const getTopHeadlinesFromAllSources = async (
  preferences?: UserPreferences,
  filters?: SearchFilters
): Promise<Article[]> => {
  const sourcesToUse = preferences?.sources || defaultSources;

  // Use only enabled sources
  const enabledSourceIds = sourcesToUse
    .filter((source) => source.enabled)
    .map((source) => source.id);

  // Apply source filters based on preferences
  const sourceFilters: SearchFilters = {
    ...filters,
    sources: filters?.sources || enabledSourceIds,
  };

  // Parallel fetch from all enabled sources
  const promises: Promise<Article[]>[] = [];

  if (enabledSourceIds.includes("newsapi")) {
    promises.push(getTopHeadlines(sourceFilters));
  }

  if (enabledSourceIds.includes("guardian")) {
    promises.push(getLatestNews(sourceFilters));
  }

  if (enabledSourceIds.includes("nytimes")) {
    promises.push(getTopStories());
  }

  try {
    const results = await Promise.all(promises);

    // Combine results from all sources
    return results.flat().sort((a, b) => {
      // Sort by publication date (newest first)
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    return [];
  }
};

// Function to search for articles across all enabled sources
export const searchAllSources = async (
  filters: SearchFilters,
  preferences?: UserPreferences
): Promise<Article[]> => {
  const sourcesToUse = preferences?.sources || defaultSources;

  // Use only enabled sources
  const enabledSourceIds = sourcesToUse
    .filter((source) => source.enabled)
    .map((source) => source.id);

  // Apply source filters based on preferences
  const sourceFilters: SearchFilters = {
    ...filters,
    sources: filters.sources || enabledSourceIds,
  };

  // Parallel fetch from all enabled sources
  const promises: Promise<Article[]>[] = [];

  if (enabledSourceIds.includes("newsapi")) {
    promises.push(searchNewsApi(sourceFilters));
  }

  if (enabledSourceIds.includes("guardian")) {
    promises.push(searchGuardianArticles(sourceFilters));
  }

  if (enabledSourceIds.includes("nytimes")) {
    promises.push(searchNYTArticles(sourceFilters));
  }

  try {
    const results = await Promise.all(promises);

    // Combine results from all sources
    return results.flat().sort((a, b) => {
      // Sort by publication date (newest first)
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
  } catch (error) {
    console.error("Error searching articles:", error);
    return [];
  }
};
