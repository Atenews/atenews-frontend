import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export interface Query {
  posts: {
    nodes: Article[];
  };
}

const handler = procedure.query(async () => {
  const data = await WPGraphQL.request<Query>(
    gql`
      query Sitemap {
        posts(first: 30) {
          nodes {
            slug
            categories {
              nodes {
                name
                databaseId
                slug
              }
            }
            databaseId
          }
        }
      }              
    `,
  );
  return data;
});

export default handler;
