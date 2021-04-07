import React from 'react';

import { NextSeo } from 'next-seo';
import DefaultErrorPage from '@/components/404';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

import { decode } from 'html-entities';
import CustomPage from '@/components/CustomPage';

import { Grid } from '@material-ui/core';

import { useAuth } from '@/utils/hooks/useAuth';

const useStyles = makeStyles(() => ({
  contentContainer: {
    width: '90%',
    margin: 'auto',
  },
}));

export default function Page({ page }) {
  const classes = useStyles();
  const theme = useTheme();
  const { loadingAuth } = useAuth();

  if (!page) {
    return (
      <DefaultErrorPage />
    );
  }

  return (
    <div className={classes.container}>
      <NextSeo
        title={`${decode(page.title)} - Atenews`}
        openGraph={{
          title: `${decode(page.title)} - Atenews`,
          images: [
            {
              url: '/default-thumbnail.jpg',
            },
          ],
          type: 'article',
        }}
        twitter={{
          handle: '@atenews',
          cardType: 'summary_large_image',
        }}
      />
      { !loadingAuth ? (
        <CustomPage page={page} />
      ) : (
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
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

export const getStaticProps = async () => {
  let res = {};
  try {
    const data = await WPGraphQL.request(
      gql`
        query Terms {
          page(id: "privacy-policy", idType: URI) {
            content
            title
            date
          }
        }             
      `,
    );
    res = data.page;
  } catch (err) {
    res = {};
  }
  if (res) {
    if ('content' in res) {
      return { props: { page: res }, revalidate: 10 };
    }
  }
  return { props: { page: null }, revalidate: 10 };
};
