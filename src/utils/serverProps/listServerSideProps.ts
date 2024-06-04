import type { GetServerSideProps } from 'next';
import { appRouter } from '@/server/routers/_app';

import { createCallerFactory } from '@/server/trpc';

export interface ListServerSideProps {
  articlesRaw: Article[];
  categoryName: string;
  category: number;
  categorySEO: {
    fullHead: string;
    title: string;
  };
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}

const listServerSideProps: GetServerSideProps<ListServerSideProps> = async ({
  req,
  res,
  params,
}) => {
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({ req, res });

  try {
    const paramValue = params?.sub || params?.main;

    const CATEGORY_SLUG = paramValue?.toString() ?? '';
    const categoryData = await caller.category({ categorySlug: CATEGORY_SLUG });
    const CATEGORY_ID = categoryData.category.databaseId;
    if (!CATEGORY_ID) {
      return { notFound: true };
    }

    const data = await caller.articles({
      category: CATEGORY_ID,
    });

    return {
      props: {
        articlesRaw: data.articlesRaw,
        categoryName: categoryData.category.name,
        category: CATEGORY_ID,
        categorySEO: categoryData.category.seo,
        pageInfo: data.pageInfo,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default listServerSideProps;
