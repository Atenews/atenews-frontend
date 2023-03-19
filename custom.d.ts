declare type ReactType = 'happy' | 'sad' | 'angry' | 'disgusted' | 'worried';

declare interface Author {
  firstName: string;
  lastName: string;
  databaseId: number;
  display_name?: string;
  nickname?: string;
  description?: string;
  avatar?: {
    url: string;
  };
  roles?: {
    nodes: {
      name: string;
    }[];
  };
}

declare interface Staff {
  id: number;
  display_name: string;
  user_nicename: string;
  avatar: string;
  roles: string[];
}

declare interface Category {
  name: string;
  databaseId: number;
  slug: string;
  description?: string;
  uri?: string;
  seo?: {
    fullHead: string;
    title: string;
  };
}

declare interface Article {
  title: string;
  slug: string;
  date: string;
  postViews: number;
  coauthors: {
    nodes: Author[];
  };
  seo?: {
    fullHead: string;
    metaDesc: string;
    title: string;
  };
  excerpt: string;
  categories: {
    nodes: Category[];
  };
  databaseId: number;
  featuredImage: {
    node: {
      sourceUrl: string;
      caption?: string;
    };
  };
  content?: string;
}

declare interface Menu {
  id: string;
  url: string;
  label: string;
  parentId: string;
  children?: Menu[];
  [key: string]: string | Menu[] | undefined;
}
