import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

const listServerSideProps = async (CATEGORY_ID) => {
  try {
    const data = await WPGraphQL.request(
      gql`
        query Articles {
          posts(first: 5, where: { categoryId: ${CATEGORY_ID} }) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              title(format: RENDERED)
              slug
              date
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                }
              }
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
                }
              }
            }
          }
        }            
      `,
    );
    return {
      props: {
        articlesRaw: data.posts.nodes,
        category: CATEGORY_ID,
        pageInfo: data.posts.pageInfo,
      },
    };
  } catch (err) {
    return { props: { articlesRaw: [], category: CATEGORY_ID } };
  }
};

export default listServerSideProps;
