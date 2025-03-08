import { UserPreferences } from "../types/news";

const USER_PREFERENCES_KEY = "news-aggregator-preferences";

export const getUserPreferences = (): UserPreferences | null => {
  if (typeof window === "undefined") return null;

  const storedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
  if (!storedPreferences) return null;

  try {
    return JSON.parse(storedPreferences) as UserPreferences;
  } catch (error) {
    console.error("Failed to parse user preferences", error);
    return null;
  }
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
};

export const clearUserPreferences = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_PREFERENCES_KEY);
};
