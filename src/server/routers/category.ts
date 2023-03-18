import { z } from 'zod';
import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export interface Query {
  category: {
    databaseId: number;
    name: string;
    description: string;
    uri: string;
  };
}

const handler = procedure.input(
  z.object({
    categorySlug: z.string(),
  }),
).query(async ({ input: { categorySlug } }) => {
  const data = await WPGraphQL.request<Query>(
    gql`
        query Category {
          category( id: "${categorySlug}", idType: SLUG ) {
            databaseId
            name
            description
            uri
          }
        }            
      `,
  );
  return {
    category: data.category,
  };
});

export default handler;
