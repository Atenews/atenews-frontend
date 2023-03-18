import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';
import type { GetServerSideProps } from 'next';

interface ArticlesData {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    nodes: {
      title: string;
      slug: string;
      date: string;
      postViews: number;
      coauthors: {
        nodes: {
          firstName: string;
          lastName: string;
          databaseId: number;
        }[];
      };
      excerpt: string;
      categories: {
        nodes: {
          name: string;
          databaseId: number;
          slug: string;
        }[];
      };
      databaseId: number;
      featuredImage: {
        node: {
          sourceUrl: string;
        };
      };
    }[];
  };
}

const articleServerSideProps: GetServerSideProps = async ({ params }) => {
  let articleData: ArticleData | null = null;

  try {
    const tempData = await WPGraphQL.request<{ post: ArticleData }>(
      gql`
        query Article {
          post( id: "${params?.slug}" , idType: SLUG ) {
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
    articleData = tempData.post;
  } catch (err) {
    articleData = null;
  }
  if (articleData) {
    const articleCategories = articleData.categories?.nodes;
    /* if (articleCategories.filter((cat) => categories.includes(cat.databaseId)).length === 0) {
      return { notFound: true };
    } */
    const relatedCategories = articleCategories?.reduce((accumulator: Array<number>, current) => {
      accumulator.push(current.databaseId);
      return accumulator;
    }, []);

    const data = await WPGraphQL.request<ArticlesData>(
      gql`
        query Articles {
          posts(first: 5, where: { notIn: [${articleData.databaseId}], categoryIn: [${relatedCategories?.toString()}] }) {
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
        post: articleData,
        relatedPosts: data.posts.nodes,
        categories: articleCategories,
        pageInfo: data.posts.pageInfo,
      },
    };
  }
  return { notFound: true };
};

export default articleServerSideProps;
