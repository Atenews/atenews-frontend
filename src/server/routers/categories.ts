import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

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

const handler = procedure.query(async () => {
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
