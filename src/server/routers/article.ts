import { z } from 'zod';
import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export interface Query {
  post: Article;
}

const handler = procedure.input(
  z.object({
    slug: z.string(),
  }),
).query(async ({ input: { slug } }) => {
  const data = await WPGraphQL.request<Query>(
    gql`
      query Article {
        post( id: "${slug}" , idType: SLUG ) {
          title(format: RENDERED)
          slug
          date
          seo {
            fullHead
            metaDesc
            title
          }
          postViews
          coauthors {
            nodes {
              firstName
              lastName
              databaseId
              nickname
              description
              avatar {
                url
              }
              roles {
                nodes {
                  name
                }
              }
            }
          }
          content
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
              caption
            }
          }
        }
      }            
    `,
  );
  return data.post;
});

export default handler;
