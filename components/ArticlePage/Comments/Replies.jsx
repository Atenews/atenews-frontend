import React from 'react';

import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import Template from '@/components/ArticlePage/Comments/Template';
import { useArticle } from '@/utils/hooks/useArticle';

export default function Replies({
  rootDetails,
  slug,
}) {
  const [loading, setLoading] = React.useState(false);

  const {
    users: { users, setUsers },
    replies: { repliesSocialStats, setRepliesSocialStats },
  } = useArticle();

  if (loading) {
    return (
      <Grid container direction="row" justifyContent="center">
        <CircularProgress style={{ marginTop: 20 }} />
      </Grid>
    );
  }

  return (
    <>
      {/* replies.map((reply) => (repliesSocialStats[reply.id] ? (
        <Template
          details={reply}
          key={reply.id}
          slug={slug}
          reply
        />
      ) : null)) */}
    </>
  );
}
