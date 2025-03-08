"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserPreferencesEditor } from "@/components/news/UserPreferencesEditor";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import { UserPreferences } from "@/lib/types/news";

export default function PreferencesPage() {
  const { preferences, isLoading, resetPreferences } = useUserPreferences();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdatePreferences = (newPreferences: UserPreferences) => {
    // In a real app, you would update the preferences in your hook
    // For now, we'll just show a success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Preferences</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Customize your news feed to see the content that matters to you
          </p>
        </div>

        {showSuccess && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Your preferences have been saved successfully!
                </p>
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
