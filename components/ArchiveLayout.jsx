import React from 'react';

import dynamic from 'next/dynamic';

import Head from 'next/head';
import parse from 'html-react-parser';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import {
  Typography, Grid, Hidden, CircularProgress,
} from '@mui/material';

import { useTrending } from '@/utils/hooks/useTrending';
import { useRouter } from 'next/router';

import { useAuth } from '@/utils/hooks/useAuth';

import InfiniteScroll from 'react-infinite-scroll-component';

import postFetch from '@/utils/postFetch';

const Article = dynamic(import('@/components/List/Article'));
const Trending = dynamic(import('@/components/Home/Trending'));
const FollowButton = dynamic(import('@/components/Social/FollowButton'));

const useStyles = makeStyles({
  account: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    right: 0,
    marginRight: 20,
    height: 65,
  },
  container: {
    minHeight: 800,
  },
});

export default function Page({
  articlesRaw, categoryName, category, nofollow, pageInfo, query, categorySEO,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { loadingAuth } = useAuth();

  let fullHead;
  if (categorySEO) {
    fullHead = parse(categorySEO?.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-'));
  }

  // eslint-disable-next-line no-underscore-dangle
  const [articles, setArticles] = React.useState(articlesRaw);
  const [hasMore, setHasMore] = React.useState(true);
  const [cursor, setCursor] = React.useState(null);

  React.useEffect(() => {
    setArticles(articlesRaw);
    setCursor(pageInfo.endCursor);
    setHasMore(pageInfo.hasNextPage);
  }, [articlesRaw]);

  const next = () => {
    if (category !== 'search') {
      postFetch('/api/graphql/getArticles', {
        category,
        cursor,
      }).then((res) => res.json()).then((x) => {
        setHasMore(x.pageInfo.hasNextPage);
        setCursor(x.pageInfo.endCursor);
        setArticles([...articles, ...x.articlesRaw]);
      });
    } else {
      postFetch('/api/graphql/getSearch', {
        query,
        cursor,
      }).then((res) => res.json()).then((x) => {
        setHasMore(x.pageInfo.hasNextPage);
        setCursor(x.pageInfo.endCursor);
        setArticles([...articles, ...x.articlesRaw]);
      });
    }
  };

  const trending = useTrending();

  const baseUrlMenu = (url) => (url !== '/' ? `${url.split('/').slice(0, 2).join('/')}` : '/');

  return (
    <div className={classes.container}>
      <Head>
        {categorySEO ? (
          <>
            <title>
              { categorySEO.title }
            </title>
            { fullHead }
          </>
        ) : (
          <title>
            {`${categoryName} - Atenews`}
          </title>
        )}
      </Head>
      { !loadingAuth ? (
        <>
          <Grid container alignItems="center" style={{ marginBottom: theme.spacing(2) }} spacing={4}>
            <Grid item>
              <Hidden mdDown>
                <Typography variant="h3" component="h1">{categoryName}</Typography>
              </Hidden>
              <Hidden mdUp>
                <Typography variant="h4" component="h1">{categoryName}</Typography>
              </Hidden>
            </Grid>
            {baseUrlMenu(router.pathname) !== '/search' && !nofollow ? (
              <Grid item xs>
                <FollowButton key={category} category={category} />
              </Grid>
            ) : null }
          </Grid>
          <Trending articles={trending} />
          <InfiniteScroll
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
            { articles.map((article, index) => (
              <Article key={index} article={article} />
            ))}
          </InfiniteScroll>
        </>
      ) : (
        <Grid
          container
          spacing={0}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item>
            <img src={theme.palette.mode === 'light' ? '/logo-blue.png' : '/logo.png'} alt="Atenews Logo" width="100" />
          </Grid>
        </Grid>
      ) }
    </div>
  );
}
