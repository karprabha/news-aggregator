export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl?: string;
  source: string;
  author?: string;
  category?: string;
  publishedAt: string;
}

export interface NewsSource {
  id: string;
  name: string;
  enabled: boolean;
}

export interface NewsCategory {
  id: string;
  name: string;
  enabled: boolean;
}

export interface NewsAuthor {
  id: string;
  name: string;
  enabled: boolean;
}

export interface UserPreferences {
  sources: NewsSource[];
  categories: NewsCategory[];
  authors: NewsAuthor[];
}

export interface SearchFilters {
  keyword?: string;
  sources?: string[];
  categories?: string[];
  authors?: string[];
  fromDate?: string;
  toDate?: string;
}
