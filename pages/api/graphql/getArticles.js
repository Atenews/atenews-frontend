import WPGraphQL from '@/utils/wpgraphql';
import { gql } from '@apollo/client';

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
    const { data } = await WPGraphQL.query({
      query: gql`
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
    });
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
