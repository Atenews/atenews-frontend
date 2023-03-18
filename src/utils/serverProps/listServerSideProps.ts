import { gql } from 'graphql-request';
import type { GetServerSideProps } from 'next';
import WPGraphQL from '@/utils/wpgraphql';

interface Category {
  databaseId: number;
  name: string;
  uri: string;
  seo: {
    fullHead: string;
    title: string;
  };
}

interface Author {
  firstName: string;
  lastName: string;
  databaseId: number;
}

interface CategoryNode {
  name: string;
  databaseId: number;
  slug: string;
}

interface PostNode {
  title: string;
  slug: string;
  date: string;
  postViews: number;
  coauthors: {
    nodes: Author[];
  };
  excerpt: string;
  categories: {
    nodes: CategoryNode[];
  };
  databaseId: number;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

interface Posts {
  nodes: PostNode[];
  pageInfo: PageInfo;
}

interface ArticlesData {
  posts: Posts;
}

const listServerSideProps = async (paramValue: string) => {
  try {
    const CATEGORY_SLUG = paramValue?.toString();
    console.log('CATEGORY_SLUG', CATEGORY_SLUG);
    const categoryData = await WPGraphQL.request<{ category: Category }>(
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
    console.log('categoryData', categoryData);
    const CATEGORY_ID = categoryData.category.databaseId;
    if (!CATEGORY_ID) {
      return { notFound: true };
    }
    const data = await WPGraphQL.request<ArticlesData>(
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
