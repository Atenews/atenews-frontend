/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';
import firebase from '@/utils/firebase';

const getViewCount = (post) => new Promise((resolve, reject) => {
  const statsRef = firebase.database().ref(`articles/${post.slug}`);
  statsRef.once('value').then((stat) => {
    if (stat.exists()) {
      resolve(stat.val().viewsCount);
    } else {
      reject();
    }
  });
});

export default async (req, res) => {
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array).catch((err) => console.log(err));
    }
  };

  if (req.method !== 'POST') {
    res.status(500).send({
      error: 'Not a POST request.',
    });
  }

  try {
    const data = await WPGraphQL.request(
      gql`
        query Articles {
          posts(first: 50) {
            nodes {
              slug
              databaseId
            }
          }
        }
      `,
    );

    await asyncForEach(data.posts.nodes, async (post) => {
      const viewCount = await getViewCount(post);
      await WPGraphQL.request(
        gql`
          mutation MyMutation {
            __typename
            modifyViewCount(input: {postId: ${post.databaseId}, postViews: ${viewCount}}) {
              postViews
            }
          }         
        `,
      );
    });

    res.status(200).send({
      postViews: true,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
