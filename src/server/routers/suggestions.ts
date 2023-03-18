import { z } from 'zod';
import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export interface Article {
  title: string;
  slug: string;
  date: string;
  postViews: number;
  coauthors: {
    nodes: {
      firstName: string;
      lastName: string;
      databaseId: number;
    }[];
  };
  excerpt: string;
  categories: {
    nodes: {
      name: string;
      databaseId: number;
      slug: string;
    }[];
  };
  databaseId: number;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
}

export interface Query {
  posts: {
    nodes: Article[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

const handler = procedure.input(
  z.object({
    categories: z.string(),
    cursor: z.string().optional(),
    articleId: z.number(),
  }),
).query(async ({ input: { categories, cursor, articleId } }) => {
  const data = await WPGraphQL.request<Query>(
    gql`
        query Articles {
          posts(first: 5, after: ${cursor ? `"${cursor}"` : null}, where: { notIn: [${articleId}], categoryIn: [${JSON.parse(categories).toString()}] }) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              title(format: RENDERED)
              slug
              date
              postViews
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                }
              }
              excerpt
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              databaseId
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
            }
          }
        }            
      `,
  );
  return {
    articlesRaw: data.posts.nodes,
    pageInfo: data.posts.pageInfo,
  };
});

export default handler;
