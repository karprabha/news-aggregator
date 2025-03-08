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
  const categoriesToUse = preferences?.categories || defaultCategories;
  const authorsToUse = preferences?.authors || [];

  // Use only enabled sources
  const enabledSourceIds = sourcesToUse
    .filter((source) => source.enabled)
    .map((source) => source.id);

  // Use only enabled categories
  const enabledCategoryIds = categoriesToUse
    .filter((category) => category.enabled)
    .map((category) => category.id);

  // Use only enabled authors
  const enabledAuthorIds = authorsToUse
    .filter((author) => author.enabled)
    .map((author) => author.id);

  // Apply filters based on preferences
  const sourceFilters: SearchFilters = {
    ...filters,
    sources: filters?.sources || enabledSourceIds,
    categories:
      filters?.categories ||
      (enabledCategoryIds.length > 0 ? enabledCategoryIds : undefined),
    authors:
      filters?.authors ||
      (enabledAuthorIds.length > 0 ? enabledAuthorIds : undefined),
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
    let combinedResults = results.flat().sort((a, b) => {
      // Sort by publication date (newest first)
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    // Filter by category if specified
    if (enabledCategoryIds.length > 0) {
      combinedResults = combinedResults.filter(
        (article) =>
          !article.category ||
          enabledCategoryIds.includes(article.category.toLowerCase())
      );
    }

    // Filter by author if specified
    if (enabledAuthorIds.length > 0) {
      combinedResults = combinedResults.filter(
        (article) =>
          !article.author || enabledAuthorIds.includes(article.author)
      );
    }

    return combinedResults;
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
  const categoriesToUse = preferences?.categories || defaultCategories;
  const authorsToUse = preferences?.authors || [];

  // Use only enabled sources
  const enabledSourceIds = sourcesToUse
    .filter((source) => source.enabled)
    .map((source) => source.id);

  // Use only enabled categories
  const enabledCategoryIds = categoriesToUse
    .filter((category) => category.enabled)
    .map((category) => category.id);

  // Use only enabled authors
  const enabledAuthorIds = authorsToUse
    .filter((author) => author.enabled)
    .map((author) => author.id);

  // Apply filters based on preferences
  const sourceFilters: SearchFilters = {
    ...filters,
    sources: filters.sources || enabledSourceIds,
    categories:
      filters.categories ||
      (enabledCategoryIds.length > 0 ? enabledCategoryIds : undefined),
    authors:
      filters.authors ||
      (enabledAuthorIds.length > 0 ? enabledAuthorIds : undefined),
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
    let combinedResults = results.flat().sort((a, b) => {
      // Sort by publication date (newest first)
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    // Filter by category if specified
    if (enabledCategoryIds.length > 0 && !filters.categories) {
      combinedResults = combinedResults.filter(
        (article) =>
          !article.category ||
          enabledCategoryIds.includes(article.category.toLowerCase())
      );
    }

    // Filter by author if specified
    if (enabledAuthorIds.length > 0 && !filters.authors) {
      combinedResults = combinedResults.filter(
        (article) =>
          !article.author || enabledAuthorIds.includes(article.author)
      );
    }

    return combinedResults;
  } catch (error) {
    console.error("Error searching articles:", error);
    return [];
  }
};
