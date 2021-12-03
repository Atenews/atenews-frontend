import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

const listServerSideProps = async (CATEGORY_SLUG) => {
  try {
    const categoryData = await WPGraphQL.request(
      gql`
        query Category {
          category( id: "${CATEGORY_SLUG}", idType: SLUG ) {
            databaseId
            name
            uri
            seo {
              fullHead
              title
            }
          }
        }
      `,
    );
    const CATEGORY_ID = categoryData.category.databaseId;
    if (!CATEGORY_ID) {
      return { notFound: true };
    }
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
              postViews
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
        categoryName: categoryData.category.name,
        category: CATEGORY_ID,
        categorySEO: categoryData.category.seo,
        pageInfo: data.posts.pageInfo,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default listServerSideProps;
