"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import { SearchBar } from "@/components/news/SearchBar";
import { NewsFilters } from "@/components/news/NewsFilters";
import { Article, SearchFilters as SearchFiltersType } from "@/lib/types/news";
import { getTopHeadlinesFromAllSources } from "@/lib/api/newsService";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import Link from "next/link";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const { preferences } = useUserPreferences();

  // Check if user has customized preferences
  const hasCustomPreferences =
    preferences.sources.some((source) => !source.enabled) ||
    preferences.categories.some((category) => !category.enabled) ||
    preferences.authors.length > 0;

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await getTopHeadlinesFromAllSources(preferences, filters);
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [preferences, filters]);

  const handleSearch = (newFilters: SearchFiltersType) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = (newFilters: SearchFiltersType) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          {hasCustomPreferences ? (
            <>
              <h1 className="mb-2 text-3xl font-bold">
                Your Personalized Feed
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                News tailored to your preferences.
                <Link
                  href="/preferences"
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Update your preferences
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-3xl font-bold">Top Headlines</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Stay informed with the latest news from trusted sources.
                <Link
                  href="/preferences"
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Personalize your feed
                </Link>
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="w-full md:w-2/3">
            <SearchBar onSearch={handleSearch} initialFilters={filters} />
          </div>
          <div className="w-full md:w-1/3">
            <NewsFilters
              onApplyFilters={handleApplyFilters}
              currentFilters={filters}
            />
          </div>
        </div>

        <ArticleGrid articles={articles} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}
