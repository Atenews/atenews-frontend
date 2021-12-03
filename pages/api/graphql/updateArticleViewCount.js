import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export default async (req, res) => {
  const {
    slug,
  } = req.body;
  if (req.method !== 'POST') {
    res.status(500).send({
      error: 'Not a POST request.',
    });
  }
  try {
    const data = await WPGraphQL.request(
      gql`
        query Article {
          post( id: "${slug}", idType: SLUG ) {
            postViewsAndUpdate
          }
        }            
      `,
    );
    res.status(200).send({
      postViews: data.post.postViewsAndUpdate,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
