import { useState } from "react";
import { UserPreferences, NewsSource, NewsCategory } from "@/lib/types/news";
import { defaultSources, defaultCategories } from "@/lib/api/newsService";

interface UserPreferencesEditorProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
  onClose: () => void;
}

export const UserPreferencesEditor = ({
  preferences,
  onUpdatePreferences,
  onClose,
}: UserPreferencesEditorProps) => {
  const [selectedSources, setSelectedSources] = useState<NewsSource[]>(
    preferences.sources
  );
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>(
    preferences.categories
  );

  const handleToggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.map((source) =>
        source.id === sourceId
          ? { ...source, enabled: !source.enabled }
          : source
      )
    );
  };

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
  };

  const handleSave = () => {
    onUpdatePreferences({
      ...preferences,
      sources: selectedSources,
      categories: selectedCategories,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedSources(defaultSources);
    setSelectedCategories(defaultCategories);
  };

  const enabledSourcesCount = selectedSources.filter(
    (source) => source.enabled
  ).length;
  const enabledCategoriesCount = selectedCategories.filter(
    (category) => category.enabled
  ).length;

  return (
    <div className="mt-6 rounded-lg border border-neutral-300 p-6 dark:border-neutral-700">
      <h2 className="mb-6 text-2xl font-bold">Customize Your News Feed</h2>

      <div className="mb-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400 dark:text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              How personalization works
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                Your preferences directly affect the news displayed on your home
                page. Only articles from enabled sources and categories will
                appear in your feed. The more specific your preferences, the
                more tailored your news experience will be.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">News Sources</h3>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {enabledSourcesCount} of {selectedSources.length} enabled
            </span>
          </div>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            Select which news sources you want to include in your feed.
            Disabling a source will remove its articles from your feed.
          </p>
          <div className="flex flex-wrap gap-3">
            {selectedSources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleToggleSource(source.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
                  source.enabled
                    ? "bg-neutral-800 text-white dark:bg-neutral-700"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
                aria-pressed={source.enabled}
                aria-label={`Toggle ${source.name} news source`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">News Categories</h3>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {enabledCategoriesCount} of {selectedCategories.length} enabled
            </span>
          </div>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            Select the categories of news you&apos;re interested in. Articles
            will be filtered to show only your selected categories.
          </p>
          <div className="flex flex-wrap gap-3">
            {selectedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleToggleCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
                  category.enabled
                    ? "bg-neutral-800 text-white dark:bg-neutral-700"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
                aria-pressed={category.enabled}
                aria-label={`Toggle ${category.name} news category`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between border-t border-neutral-200 pt-6 dark:border-neutral-700">
          <button
            onClick={handleReset}
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            aria-label="Reset preferences to default"
          >
            Reset to Default
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              aria-label="Cancel changes"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-md border border-transparent bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              aria-label="Save preferences"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
