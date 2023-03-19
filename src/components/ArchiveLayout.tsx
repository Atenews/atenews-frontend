import React from 'react';

import dynamic from 'next/dynamic';

import Head from 'next/head';
import parse from 'html-react-parser';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import trpc from '@/utils/trpc';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'next/router';

import InfiniteScroll from 'react-infinite-scroll-component';

const Article = dynamic(import('@/components/List/Article'));

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

interface Props {
  articlesRaw: Article[];
  categoryName: string;
  category?: number;
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  query?: string;
  categorySEO?: {
    title: string;
    fullHead: string;
  };
}

const ArchiveLayout: React.FC<Props> = ({
  articlesRaw, categoryName, category, pageInfo, query, categorySEO,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const trpcArticles = trpc.useContext().articles;
  const trpcSearch = trpc.useContext().search;

  let fullHead;
  if (categorySEO) {
    fullHead = parse(categorySEO?.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-'));
  }

  // eslint-disable-next-line no-underscore-dangle
  const [articles, setArticles] = React.useState(articlesRaw);
  const [hasMore, setHasMore] = React.useState(true);
  const [cursor, setCursor] = React.useState<string | null>(null);

  React.useEffect(() => {
    setArticles(articlesRaw);
    setCursor(pageInfo.endCursor);
    setHasMore(pageInfo.hasNextPage);
  }, [articlesRaw]);

  const next = () => {
    if (category) {
      trpcArticles.fetch({
        category,
        cursor: cursor ?? undefined,
      }).then((x) => {
        setHasMore(x.pageInfo.hasNextPage);
        setCursor(x.pageInfo.endCursor);
        setArticles([...articles, ...x.articlesRaw]);
      });
    } else if (query) {
      trpcSearch.fetch({
        query,
        cursor: cursor ?? undefined,
      }).then((x) => {
        setHasMore(x.pageInfo.hasNextPage);
        setCursor(x.pageInfo.endCursor);
        setArticles([...articles, ...x.articlesRaw]);
      });
    }
  };

  const baseUrlMenu = (url: string) => (url !== '/' ? `${url.split('/').slice(0, 2).join('/')}` : '/');

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
      <Grid container alignItems="center" style={{ marginBottom: theme.spacing(2) }} spacing={4}>
        <Grid item>
          <Hidden mdDown>
            <Typography variant="h3" component="h1">{categoryName}</Typography>
          </Hidden>
          <Hidden mdUp>
            <Typography variant="h4" component="h1">{categoryName}</Typography>
          </Hidden>
        </Grid>
      </Grid>
      { /* TODO: add Trending */ }
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
    </div>
  );
};

export default ArchiveLayout;
