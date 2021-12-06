import React from 'react';

import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import Template from '@/components/ArticlePage/Comments/Template';
import firebase from '@/utils/firebase';
import { useArticle } from '@/utils/hooks/useArticle';
import useFirestoreSubscribe from '@/utils/hooks/useFirestoreSubscribe';

export default function Replies({
  rootDetails,
  slug,
}) {
  const [loading, setLoading] = React.useState(false);

  const {
    users: { users, setUsers },
    replies: { repliesSocialStats, setRepliesSocialStats },
  } = useArticle();

  const updateUsersCache = async (userId) => {
    if (!users[userId]) {
      const user = await firebase.firestore().collection('users').doc(userId).get();
      setUsers((prevState) => ({
        ...prevState,
        [user.id]: user.data(),
      }));
    }
  };

  const repliesRef = firebase.firestore().collection('replies')
    .where('commentId', '==', rootDetails.id)
    .orderBy('timestamp', 'asc');

  const [replies] = useFirestoreSubscribe(repliesRef, {
    started: () => {
      setLoading(true);
    },
    added: async (change) => {
      await updateUsersCache(change.doc.data().userId);
      setRepliesSocialStats((prev) => ({
        ...prev,
        [change.doc.id]: {
          upvoteCount: change.doc.data().upvoteCount,
          downvoteCount: change.doc.data().downvoteCount,
        },
      }));
    },
    modified: (change) => {
      if (repliesSocialStats[change.doc.id] !== {
        upvoteCount: change.doc.data().upvoteCount,
        downvoteCount: change.doc.data().downvoteCount,
      }) {
        setRepliesSocialStats((prev) => ({
          ...prev,
          [change.doc.id]: {
            upvoteCount: change.doc.data().upvoteCount,
            downvoteCount: change.doc.data().downvoteCount,
          },
        }));
      }
    },
    sort: (a, b) => (
      a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime()
    ),
    any: () => {
      setLoading(false);
    },
  });

  if (loading) {
    return (
      <Grid container direction="row" justifyContent="center">
        <CircularProgress style={{ marginTop: 20 }} />
      </Grid>
    );
  }

  return (
    <>
      { replies.map((reply) => (repliesSocialStats[reply.id] ? (
        <Template
          details={reply}
          key={reply.id}
          slug={slug}
          reply
        />
      ) : null))}
    </>
  );
}
