import Image from "next/image";
import { Article } from "@/lib/types/news";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export const ArticleCard = ({ article, className }: ArticleCardProps) => {
  const {
    title,
    description,
    imageUrl,
    source,
    author,
    publishedAt,
    url,
    category,
  } = article;

  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleArticleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleArticleClick();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg dark:bg-neutral-900 h-full",
        className
      )}
    >
      <div
        onClick={handleArticleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`Read article: ${title}`}
        className="flex h-full flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-500"
      >
        {imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
            <span className="text-neutral-500 dark:text-neutral-400">
              No image available
            </span>
          </div>
        )}

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold uppercase">{source}</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="mb-2 mt-2 line-clamp-2 text-lg font-bold">{title}</h3>

          <p className="mb-4 line-clamp-3 flex-grow text-sm text-neutral-600 dark:text-neutral-300">
            {description || "No description available"}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between">
            {category && (
              <span className="mb-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                {category}
              </span>
            )}
            {author && (
              <span className="mb-1 text-xs italic text-neutral-500 dark:text-neutral-400">
                By {author}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArticleCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-md h-full">
      <Skeleton className="h-48 w-full" />
      <div className="flex flex-col p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mt-2" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between mt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
};
