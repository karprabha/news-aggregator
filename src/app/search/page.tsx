"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import { SearchBar } from "@/components/news/SearchBar";
import { NewsFilters } from "@/components/news/NewsFilters";
import { Article, SearchFilters as SearchFiltersType } from "@/lib/types/news";
import { searchAllSources } from "@/lib/api/newsService";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";

export default function SearchPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: "",
  });
  const { preferences } = useUserPreferences();
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Only search when there's a keyword
    if (filters.keyword) {
      const searchArticles = async () => {
        setIsLoading(true);
        try {
          const data = await searchAllSources(filters, preferences);
          setArticles(data);
          setHasSearched(true);
        } catch (error) {
          console.error("Failed to search articles:", error);
        } finally {
          setIsLoading(false);
        }
      };

      searchArticles();
    }
  }, [filters, preferences]);

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
          <h1 className="mb-2 text-3xl font-bold">Search News</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Search for news articles across multiple sources
          </p>
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

        {!hasSearched && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="mb-2 text-xl font-semibold">
              Enter a search term to find news
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Use the search bar above to find articles on topics you're
              interested in
            </p>
          </div>
        ) : (
          <ArticleGrid articles={articles} isLoading={isLoading} />
        )}
      </div>
    </MainLayout>
  );
}
