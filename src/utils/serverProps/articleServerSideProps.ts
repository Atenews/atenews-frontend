// This code gets the article data from the database and sends it to the client.
// It also gets related posts based on the categories of the article.
// The article slug is used to get the data.

import type { GetServerSideProps } from 'next';
import { appRouter } from '@/server/routers/_app';

import { createCallerFactory } from '@/server/trpc';

export interface ArticleServerSideProps {
  post: Article;
  relatedPosts: Article[];
  categories: Category[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}

const articleServerSideProps: GetServerSideProps<ArticleServerSideProps> = async ({
  req,
  res,
  params,
}) => {
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({ req, res });
  let articleData: Article | null = null;

  try {
    const tempData = await caller.article({ slug: params?.slug?.toString() ?? '' });
    articleData = tempData;
  } catch (err) {
    articleData = null;
  }
  if (articleData) {
    const articleCategories = articleData.categories?.nodes;
    /* if (articleCategories.filter((cat) => categories.includes(cat.databaseId)).length === 0) {
      return { notFound: true };
    } */
    const relatedCategories = articleCategories?.reduce((accumulator: Array<number>, current) => {
      accumulator.push(current.databaseId);
      return accumulator;
    }, []);

    const data = await caller.suggestions({
      categories: JSON.stringify(relatedCategories),
      articleId: articleData.databaseId,
    });

    return {
      props: {
        post: articleData,
        relatedPosts: data.articlesRaw,
        categories: articleCategories,
        pageInfo: data.pageInfo,
      },
    };
  }
  return { notFound: true };
};

export default articleServerSideProps;
