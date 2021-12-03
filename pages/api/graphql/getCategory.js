import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export default async (req, res) => {
  const {
    category,
  } = req.body;
  if (req.method !== 'POST') {
    res.status(500).send({
      error: 'Not a POST request.',
    });
  }
  try {
    const data = await WPGraphQL.request(
      gql`
        query Category {
          category( id: "${category}", idType: SLUG ) {
            databaseId
            name
            description
            uri
          }
        }            
      `,
    );
    res.status(200).send({
      category: data.category,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
