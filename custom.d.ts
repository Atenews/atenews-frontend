declare type ReactType = 'happy' | 'sad' | 'angry' | 'disgusted' | 'worried';

declare type Category = {
  name: string;
  databaseId: number;
  slug: string;
};

declare type Coauthor = {
  firstName: string;
  lastName: string;
  databaseId: number;
};

declare type FeaturedImage = {
  node: {
    sourceUrl: string;
    caption: string;
  };
};

declare interface ArticleData {
  id?: string;
  title?: string;
  slug?: string;
  date?: string;
  seo?: {
    fullHead: string;
    metaDesc: string;
    title: string;
  };
  postViews?: number;
  coauthors?: {
    nodes: Coauthor[];
  };
  content?: string;
  excerpt?: string;
  categories?: {
    nodes: Category[];
  };
  databaseId?: number;
  featuredImage?: FeaturedImage;
  totalReactCount?: number;
  reactCount?: {
    happy: number;
    sad: number;
    angry: number;
    disgusted: number;
    worried: number;
  };
}
