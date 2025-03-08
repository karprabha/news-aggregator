import { Article } from "@/lib/types/news";
import { ArticleCard, ArticleCardSkeleton } from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  isLoading?: boolean;
}

export const ArticleGrid = ({ articles, isLoading }: ArticleGridProps) => {
  if (isLoading) {
    // Display skeleton loaders when loading
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="mb-2 text-xl font-semibold">No articles found</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
