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

  return (
    <div className="mt-6 rounded-lg border border-neutral-300 p-6 dark:border-neutral-700">
      <h2 className="mb-6 text-2xl font-bold">Customize Your News Feed</h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-lg font-semibold">News Sources</h3>
          <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            Select which news sources you want to include in your feed.
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
          <h3 className="mb-3 text-lg font-semibold">News Categories</h3>
          <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            Select which categories of news you're interested in.
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

        <div className="flex justify-between pt-4">
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
