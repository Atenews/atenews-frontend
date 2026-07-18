import { publicProcedure } from '@/server/trpc';
import WPGraphQL, { gql } from '@/utils/wpgraphql';

export interface Query {
  posts: {
    nodes: Article[];
  };
}

const handler = publicProcedure.query(async () => {
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
