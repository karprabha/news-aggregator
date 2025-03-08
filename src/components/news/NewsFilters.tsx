import { useState } from "react";
import { SearchFilters, NewsSource, NewsCategory } from "@/lib/types/news";
import { defaultSources, defaultCategories } from "@/lib/api/newsService";

interface NewsFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
  sources?: NewsSource[];
  categories?: NewsCategory[];
}

export const NewsFilters = ({
  onApplyFilters,
  currentFilters,
  sources = defaultSources,
  categories = defaultCategories,
}: NewsFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState(currentFilters.fromDate || "");
  const [toDate, setToDate] = useState(currentFilters.toDate || "");
  const [selectedSources, setSelectedSources] = useState<string[]>(
    currentFilters.sources || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.categories || []
  );

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleSourceChange = (sourceId: string) => {
    setSelectedSources((prev) => {
      if (prev.includes(sourceId)) {
        return prev.filter((id) => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleApply = () => {
    onApplyFilters({
      ...currentFilters,
      fromDate,
      toDate,
      sources: selectedSources.length > 0 ? selectedSources : undefined,
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSelectedSources([]);
    setSelectedCategories([]);
    onApplyFilters({
      keyword: currentFilters.keyword,
    });
    setIsOpen(false);
  };

  return (
    <div className="relative mb-4 w-full">
      <button
        type="button"
        onClick={toggleFilter}
        className="flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Filter news articles"
      >
        <span>Filters</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
            clipRule="evenodd"
          />
        </svg>
        {(fromDate ||
          toDate ||
          selectedSources.length > 0 ||
          selectedCategories.length > 0) && (
          <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-neutral-500"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-2 rounded-md border border-neutral-300 bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="from-date"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                From Date
              </label>
              <input
                type="date"
                id="from-date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="to-date"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                To Date
              </label>
              <input
                type="date"
                id="to-date"
                value={toDate}
                onChange={handleToDateChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">
              Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <label
                  key={source.id}
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.id)}
                    onChange={() => handleSourceChange(source.id)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                  <span>{source.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">
              Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              aria-label="Reset filters"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-md border border-transparent bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              aria-label="Apply filters"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
