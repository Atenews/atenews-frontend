import { z } from 'zod';
import { publicProcedure } from '@/server/trpc';
import WPGraphQL, { gql } from '@/utils/wpgraphql';

export interface Query {
  category: {
    databaseId: number;
    name: string;
    description: string;
    uri: string;
    seo: {
      fullHead: string;
      title: string;
    };
  };
}

const handler = publicProcedure.input(
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
          seo {
            fullHead
            title
          }
        }
      }            
    `,
  );
  return {
    category: data.category,
  };
});

export default handler;
