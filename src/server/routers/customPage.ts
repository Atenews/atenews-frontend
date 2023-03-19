import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';
import { z } from 'zod';

export interface Query {
  page: {
    content: string;
    title: string;
    date: string;
    seo: {
      fullHead: string;
      title: string;
    };
  };
}

const handler = procedure.input(
  z.object({
    slug: z.string(),
  }),
).query(async ({ input: { slug } }) => {
  const data = await WPGraphQL.request<Query>(
    gql`
      query Terms {
        page(id: "${slug}", idType: URI) {
          content
          title
          date
          seo {
            fullHead
            title
          }
        }
      }             
    `,
  );
  return data.page;
});

export default handler;
