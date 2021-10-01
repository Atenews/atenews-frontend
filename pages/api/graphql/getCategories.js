import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(500).send({
      error: 'Not a POST request.',
    });
  }
  try {
    const data = await WPGraphQL.request(
      gql`
        query Category {
          categories(first: 100) {
            nodes {
              databaseId
              name
              description
              slug
            }
          }
        }
      `,
    );
    res.status(200).send({
      categories: data.categories.nodes,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
