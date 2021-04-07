import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';
import slugGenerator from '@/utils/slugGenerator';

export default function Page() {
  return null;
}

export const getServerSideProps = async (ctx) => {
  let res = {};
  try {
    const raw = await WPGraphQL.request(
      gql`
        query Article {
          post( id: "${ctx.params.slug}" , idType: SLUG ) {
            categories {
              nodes {
                name
                databaseId
                slug
              }
            }
            slug
          }
        }            
      `,
    );
    res = raw.post;
  } catch (err) {
    res = {};
  }
  if (res) {
    if ('categories' in res) {
      return {
        redirect: {
          destination: slugGenerator(res),
          permanent: true,
        },
      };
    }
  }
  return { notFound: true };
};
