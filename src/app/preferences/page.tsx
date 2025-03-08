"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserPreferencesEditor } from "@/components/news/UserPreferencesEditor";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import { UserPreferences } from "@/lib/types/news";
import { useRouter } from "next/navigation";

export default function PreferencesPage() {
  const { preferences, isLoading, toggleSource, toggleCategory } =
    useUserPreferences();
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleUpdatePreferences = (newPreferences: UserPreferences) => {
    // Update sources
    newPreferences.sources.forEach((newSource) => {
      const currentSource = preferences.sources.find(
        (s) => s.id === newSource.id
      );
      if (currentSource && currentSource.enabled !== newSource.enabled) {
        toggleSource(newSource.id);
      }
    });

    // Update categories
    newPreferences.categories.forEach((newCategory) => {
      const currentCategory = preferences.categories.find(
        (c) => c.id === newCategory.id
      );
      if (currentCategory && currentCategory.enabled !== newCategory.enabled) {
        toggleCategory(newCategory.id);
      }
    });

    // Show success message
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleViewPersonalizedFeed = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen animate-pulse p-4">
          <div className="h-8 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div className="mt-4 h-64 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">News Preferences</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Customize your news feed by selecting your preferred sources and
            categories
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400 dark:text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Preferences updated
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>
                    Your news preferences have been updated successfully. Your
                    news feed will now reflect these changes.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      onClick={handleViewPersonalizedFeed}
                      className="rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50"
                    >
                      View your personalized feed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <UserPreferencesEditor
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          onClose={() => {}}
        />
      </div>
    </MainLayout>
  );
}
