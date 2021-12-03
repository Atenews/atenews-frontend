import React from 'react';

import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

import ArchiveLayout from '@/components/ArchiveLayout';

export default function Page(props) {
  return (
    // eslint-disable-next-line react/destructuring-assignment
    <ArchiveLayout {...props} />
  );
}

export async function getServerSideProps({ query: rawQuery }) {
  try {
    const { query } = rawQuery;
    const data = await WPGraphQL.request(
      gql`
        query Search {
          posts(first: 5, where: { search: "${query}" }) {
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
        pageInfo: data.posts.pageInfo,
        query,
        categoryName: `Search Results for "${query}"`,
        category: 'search',
      },
    };
  } catch (err) {
    return {
      props: {
        articlesRaw: [], query: '', category: 'search',
      },
    };
  }
}
