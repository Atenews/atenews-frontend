import React from 'react';

import Article from '@/components/List/Article';
import handleViewport from 'react-in-viewport';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

import { useTheme } from '@mui/material/styles';

import InfiniteScroll from 'react-infinite-scroll-component';

import trpc from '@/utils/trpc';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  forwardedRef: React.RefObject<HTMLDivElement>;
  relatedPosts: Article[];
  postId: number;
  pageInfo: {
    endCursor: string | null;
    hasNextPage: boolean;
  };
  categories: Category[];
}

const ReadMore: React.FC<Props> = (props) => {
  const {
    forwardedRef, relatedPosts, postId, pageInfo, categories,
  } = props;
  const theme = useTheme();

  const [articles, setArticles] = React.useState<Article[]>(relatedPosts);
  const [hasMore, setHasMore] = React.useState(true);
  const [cursor, setCursor] = React.useState<string | null>(null);

  React.useEffect(() => {
    setArticles(relatedPosts);
    setCursor(pageInfo.endCursor);
    setHasMore(pageInfo.hasNextPage);
  }, [relatedPosts]);

  const trpcSuggestions = trpc.useContext().suggestions;

  const next = () => {
    const relatedCategories: number[] = categories.reduce((
      accumulator: number[],
      current: Category,
    ) => {
      accumulator.push(current.databaseId);
      return accumulator;
    }, []);

    trpcSuggestions.fetch({
      categories: JSON.stringify(relatedCategories),
      cursor: cursor ?? undefined,
      articleId: postId,
    }).then((x) => {
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
                justifyContent="center"
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
};

export default handleViewport(ReadMore);
