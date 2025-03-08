import { useState, useEffect } from "react";
import {
  UserPreferences,
  NewsSource,
  NewsCategory,
  NewsAuthor,
} from "../types/news";
import { getUserPreferences, saveUserPreferences } from "../utils/localStorage";
import { defaultSources, defaultCategories } from "../api/newsService";

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  isLoading: boolean;
  toggleSource: (sourceId: string) => void;
  toggleCategory: (categoryId: string) => void;
  toggleAuthor: (authorId: string) => void;
  addAuthor: (author: NewsAuthor) => void;
  resetPreferences: () => void;
}

export const useUserPreferences = (): UseUserPreferencesReturn => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    sources: defaultSources,
    categories: defaultCategories,
    authors: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const loadPreferences = async () => {
      const savedPreferences = getUserPreferences();

      if (savedPreferences) {
        setPreferences(savedPreferences);
      }

      setIsLoading(false);
    };

    loadPreferences();
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveUserPreferences(preferences);
    }
  }, [preferences, isLoading]);

  const toggleSource = (sourceId: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      sources: prev.sources.map((source: NewsSource) =>
        source.id === sourceId
          ? { ...source, enabled: !source.enabled }
          : source
      ),
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      categories: prev.categories.map((category: NewsCategory) =>
        category.id === categoryId
          ? { ...category, enabled: !category.enabled }
          : category
      ),
    }));
  };

  const toggleAuthor = (authorId: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      authors: prev.authors.map((author: NewsAuthor) =>
        author.id === authorId
          ? { ...author, enabled: !author.enabled }
          : author
      ),
    }));
  };

  const addAuthor = (author: NewsAuthor) => {
    // Only add if not already in the list
    setPreferences((prev: UserPreferences) => {
      const authorExists = prev.authors.some(
        (a: NewsAuthor) => a.id === author.id
      );

      if (authorExists) {
        return prev;
      }

      return {
        ...prev,
        authors: [...prev.authors, author],
      };
    });
  };

  const resetPreferences = () => {
    setPreferences({
      sources: defaultSources,
      categories: defaultCategories,
      authors: [],
    });
  };

  return {
    preferences,
    isLoading,
    toggleSource,
    toggleCategory,
    toggleAuthor,
    addAuthor,
    resetPreferences,
  };
};
