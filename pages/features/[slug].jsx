import React from 'react';

import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import DefaultErrorPage from '@/components/404';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// import articlePaths from '@/utils/serverProps/articlePaths';
import articleServerSideProps from '@/utils/serverProps/articleServerSideProps';

import { decode } from 'html-entities';

import { Grid, CircularProgress } from '@material-ui/core';

import { useAuth } from '@/utils/hooks/useAuth';
import { ArticleProvider } from '@/utils/hooks/useArticle';

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
  const { post } = args;
  const classes = useStyles();
  const theme = useTheme();
  const { loadingAuth } = useAuth();
  const router = useRouter();

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
      <NextSeo
        title={`${decode(post.title)}`}
        description={post.excerpt.replace(/<[^>]+>/g, '')}
        openGraph={{
          title: `${decode(post.title)}`,
          type: 'article',
          description: post.excerpt.replace(/<[^>]+>/g, ''),
          images: [
            {
              url: post.featuredImage?.node.sourceUrl,
            },
          ],
        }}
        twitter={{
          handle: '@atenews',
          cardType: 'summary_large_image',
        }}
      />
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
            <img src={theme.palette.type === 'light' ? '/logo-blue.png' : '/logo.png'} alt="Atenews Logo" width="100" />
          </Grid>
        </Grid>
      ) }
    </div>
  );
}

const categories = [4, 437, 31];

// export const getStaticPaths = async () => articlePaths(categories);
export const getServerSideProps = async (ctx) => articleServerSideProps(ctx, categories);
