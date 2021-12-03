import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export default async (req, res) => {
  const {
    category, cursor,
  } = req.body;
  if (req.method !== 'POST') {
    res.status(500).send({
      error: 'Not a POST request.',
    });
  }
  try {
    const data = await WPGraphQL.request(
      gql`
        query Articles {
          posts(first: 5, after: ${cursor ? `"${cursor}"` : null}, where: { categoryId: ${category} }) {
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
    res.status(200).send({
      articlesRaw: data.posts.nodes,
      pageInfo: data.posts.pageInfo,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
