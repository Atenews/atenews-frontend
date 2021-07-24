import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

const articleStaticProps = async (ctx, categories) => {
  let articleData = null;

  try {
    const tempData = await WPGraphQL.request(
      gql`
        query Article {
          post( id: "${ctx.params.slug}" , idType: SLUG ) {
            title(format: RENDERED)
            slug
            date
            postViewsAndUpdate
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
    articleData = tempData.post;
  } catch (err) {
    articleData = null;
  }
  if (articleData) {
    const articleCategories = articleData.categories.nodes;
    if (articleCategories.filter((cat) => categories.includes(cat.databaseId)).length === 0) {
      return { notFound: true, revalidate: 10 };
    }
    const data = await WPGraphQL.request(
      gql`
        query Articles {
          posts(first: 5, where: { notIn: [${articleData.databaseId}], categoryIn: [${categories.toString()}] }) {
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
        post: articleData,
        relatedPosts: data.posts.nodes,
        categories,
        pageInfo: data.posts.pageInfo,
      },
      revalidate: 10,
    };
  }
  return { notFound: true, revalidate: 10 };
};

export default articleStaticProps;
