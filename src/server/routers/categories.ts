import { publicProcedure } from '@/server/trpc';
import WPGraphQL, { gql } from '@/utils/wpgraphql';

export interface Query {
  categories: {
    nodes: {
      databaseId: number;
      name: string;
      description: string;
      slug: string;
    }[];
  };
}

const handler = publicProcedure.query(async () => {
  const data = await WPGraphQL.request<Query>(
    gql`
      query Category {
        categories(first: 100) {
          nodes {
            databaseId
            name
            description
            slug
          }
        }
      }
    `,
  );
  return {
    categories: data.categories.nodes,
  };
});

export default handler;
