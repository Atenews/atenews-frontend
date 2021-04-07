import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

const articlePaths = async (categories) => {
  let res = [];
  try {
    const temp = await Promise.all(
      categories.map(
        async (cat) => WPGraphQL.request(
          gql`
            query Slugs {
              posts(first: 1, where: { categoryId: ${cat} }) {
                nodes {
                  slug
                }
              }
            }             
          `,
        ),
      ),
    );
    temp.forEach((arr) => {
      res = [...res, ...arr.posts.nodes];
    });
  } catch (err) {
    res = [];
  }
  const paths = [];
  for (const post of res) {
    paths.push({
      params: { slug: post.slug },
    });
  }
  return {
    paths,
    fallback: true,
  };
};

export default articlePaths;
