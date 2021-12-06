import React from 'react';

import Head from 'next/head';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

// import articlePaths from '@/utils/serverProps/articlePaths';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import articleServerSideProps from '@/utils/serverProps/articleServerSideProps';

import DefaultErrorPage from '@/components/404';

import { useAuth } from '@/utils/hooks/useAuth';
import { ArticleProvider } from '@/utils/hooks/useArticle';
import { useCategory } from '@/utils/hooks/useCategory';

import ArticlePage from '@/components/ArticlePage';

const useStyles = makeStyles(() => ({
  contentContainer: {
    width: '90%',
    margin: 'auto',
  },
  container: {
    minHeight: 800,
  },
}));

export default function Page(args) {
  const { post, categories } = args;
  const fullHead = parse(post.seo.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-'));
  const classes = useStyles();
  const theme = useTheme();
  const { loadingAuth } = useAuth();
  const router = useRouter();
  const { setCategory } = useCategory();

  React.useEffect(() => {
    setCategory(categories || []);
    return () => {
      setCategory([]);
    };
  }, [post]);

  if (router.isFallback) {
    return (
      <div className={classes.contentContainer}>
        <Grid container direction="row" justifyContent="center">
          <CircularProgress style={{ marginTop: 100, marginBottom: 100 }} />
        </Grid>
      </div>
    );
  }

  if (!post) {
    return (
      <DefaultErrorPage />
    );
  }

  return (
    <div className={classes.container}>
      <Head>
        <title>
          { post.seo.title }
        </title>
        { fullHead }
      </Head>
      { !loadingAuth ? (
        <ArticleProvider post={post} key={post.id}>
          <ArticlePage {...args} />
        </ArticleProvider>
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

// export const getStaticPaths = async () => articlePaths(categories);
export const getServerSideProps = articleServerSideProps;
