import React from 'react';

import { appRouter } from '@/server/routers/_app';

import ArchiveLayout from '@/components/ArchiveLayout';
import { GetServerSideProps, NextPage } from 'next';

import { createCallerFactory } from '@/server/trpc';

interface Props {
  articlesRaw: Article[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
  query: string;
  categoryName: string;
}

const SearchPage: NextPage<Props> = (props) => (
  <ArchiveLayout {...props} />
);

export const getServerSideProps: GetServerSideProps = async ({ query: rawQuery, req, res }) => {
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({ req, res });

  try {
    const { query } = rawQuery;
    if (typeof query !== 'string') throw new Error('Invalid query type');

    const data = await caller.search({ query });

    return {
      props: {
        articlesRaw: data.articlesRaw,
        pageInfo: data.pageInfo,
        query,
        categoryName: `Search Results for "${query}"`,
      },
    };
  } catch (err) {
    return {
      props: {
        articlesRaw: [], query: '',
      },
    };
  }
};

export default SearchPage;
