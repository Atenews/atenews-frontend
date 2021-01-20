import React from 'react';

import Article from '@/components/List/Article';
import handleViewport from 'react-in-viewport';

import {
  Typography,
  Grid,
  CircularProgress,
} from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';

import InfiniteScroll from 'react-infinite-scroll-component';
import postFetch from '@/utils/postFetch';

export default handleViewport((props) => {
  const {
    forwardedRef, relatedPosts, postId, pageInfo, categories,
  } = props;
  const theme = useTheme();

  const [articles, setArticles] = React.useState(relatedPosts);
  const [hasMore, setHasMore] = React.useState(true);
  const [cursor, setCursor] = React.useState(null);

  React.useEffect(() => {
    setArticles(relatedPosts);
    setCursor(pageInfo.endCursor);
    setHasMore(pageInfo.hasNextPage);
  }, [relatedPosts]);

  const next = () => {
    postFetch('/api/graphql/getSuggestions', {
      categories: JSON.stringify(categories),
      cursor,
      articleId: postId,
    }).then((res) => res.json()).then((x) => {
      setHasMore(x.pageInfo.hasNextPage);
      setCursor(x.pageInfo.endCursor);
      setArticles([...articles, ...x.articlesRaw]);
    });
  };

  return (
    <div ref={forwardedRef}>
      <Typography variant="h4">More articles for you</Typography>
      <div style={{ marginTop: theme.spacing(4) }}>
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={articles.length}
          next={next}
          hasMore={hasMore}
          loader={(
            <div style={{ overflow: 'hidden' }}>
              <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            </div>
          )}
        >
          {
            articles.map((post) => (
              <Article
                key={post.databaseId}
                article={post}
              />
            ))
            }
        </InfiniteScroll>
      </div>
    </div>
  );
});
