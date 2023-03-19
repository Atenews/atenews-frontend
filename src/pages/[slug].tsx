import React from 'react';

import Head from 'next/head';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';

import { makeStyles } from '@mui/styles';

// import articlePaths from '@/utils/serverProps/articlePaths';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import articleServerSideProps from '@/utils/serverProps/articleServerSideProps';

import DefaultErrorPage from '@/components/404';

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

interface Props {
  post: Article;
  categories: Category[];
}

const DefaultArticlePage: React.FC<Props> = (args) => {
  const { post, categories } = args;
  const fullHead = parse(post.seo?.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-') ?? '');
  const classes = useStyles();
  const router = useRouter();
  const { setCategory } = useCategory();

  React.useEffect(() => {
    if (setCategory !== undefined) {
      setCategory(categories || []);
      return () => {
        setCategory([]);
      };
    }
    return undefined;
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
          { post.seo?.title }
        </title>
        { fullHead }
      </Head>
      <ArticlePage {...args} />
    </div>
  );
};

export default DefaultArticlePage;

// export const getStaticPaths = async () => articlePaths(categories);
export const getServerSideProps = articleServerSideProps;
