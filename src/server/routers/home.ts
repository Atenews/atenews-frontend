import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export interface Query {
  home: {
    seo: {
      fullHead: string;
    };
  };
  recentArticles: {
    nodes: Article[];
  };
  news: {
    nodes: Article[];
  };
  features: {
    nodes: Article[];
  };
  featuredPhoto: {
    nodes: Article[];
  };
  editorial: {
    nodes: Article[];
  };
  columns: {
    nodes: Article[];
  };
}

const handler = procedure.query(async () => {
  const data = await WPGraphQL.request<Query>(
    gql`
      query Home {
        home: homepage {
          seo {
            fullHead
          }
        }
        recentArticles: posts(first: 5) {
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
        news: posts(first: 5, where: { categoryName: "news" }) {
          nodes {
            title(format: RENDERED)
            slug
            date
            postViews
            databaseId
            featuredImage {
              node {
                sourceUrl(size: LARGE)
              }
            }
            categories {
              nodes {
                name
                databaseId
                slug
              }
            }
            excerpt
            coauthors {
              nodes {
                firstName
                lastName
                databaseId
              }
            }
          }
        }
        features: posts(first: 5, where: { categoryName: "features" }) {
          nodes {
            title(format: RENDERED)
            slug
            date
            postViews
            databaseId
            featuredImage {
              node {
                sourceUrl(size: LARGE)
              }
            }
            categories {
              nodes {
                name
                databaseId
                slug
              }
            }
            excerpt
            coauthors {
              nodes {
                firstName
                lastName
                databaseId
              }
            }
          }
        }
        featuredPhoto: posts(first: 1, where: { categoryName: "featured-photos" }) {
          nodes {
            databaseId
            featuredImage {
              node {
                sourceUrl(size: LARGE)
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
            coauthors {
              nodes {
                firstName
                lastName
                databaseId
              }
            }
          }
        }
        editorial: posts(first: 1, where: { categoryName: "editorial" }) {
          nodes {
            title(format: RENDERED)
            databaseId
            date
            slug
            postViews
            featuredImage {
              node {
                sourceUrl(size: LARGE)
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
            coauthors {
              nodes {
                firstName
                lastName
                databaseId
              }
            }
          }
        }
        columns: posts(first: 4, where: { categoryName: "columns" }) {
          nodes {
            title(format: RENDERED)
            databaseId
            date
            slug
            postViews
            featuredImage {
              node {
                sourceUrl(size: LARGE)
              }
            }
            categories {
              nodes {
                name
                databaseId
                slug
              }
            }
            coauthors {
              nodes {
                firstName
                lastName
                databaseId
                avatar {
                  url
                }
              }
            }
          }
        }
      }        
    `,
  );
  return {
    recentArticles: data.recentArticles.nodes,
    news: data.news.nodes,
    features: data.features.nodes,
    featuredPhoto: data.featuredPhoto.nodes[0],
    editorial: data.editorial.nodes[0],
    columns: data.columns.nodes,
    homepage: data.home,
  };
});

export default handler;
