import { z } from 'zod';
import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export interface Query {
  post: {
    postViewsAndUpdate: number;
  };
}

const handler = procedure.input(
  z.object({
    slug: z.string(),
  }),
).mutation(async ({ input: { slug } }) => {
  const data = await WPGraphQL.request<Query>(
    gql`
      query Article {
        post( id: "${slug}", idType: SLUG ) {
          postViewsAndUpdate
        }
      }            
    `,
  );
  return {
    postViews: data.post.postViewsAndUpdate,
  };
});

export default handler;
