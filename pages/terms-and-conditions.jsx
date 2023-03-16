import React from 'react';

import Head from 'next/head';
import parse from 'html-react-parser';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import { gql } from 'graphql-request';

import Grid from '@mui/material/Grid';

import WPGraphQL from '@/utils/wpgraphql';

import CustomPage from '@/components/CustomPage';

import DefaultErrorPage from '@/components/404';

const useStyles = makeStyles(() => ({
  contentContainer: {
    width: '90%',
    margin: 'auto',
  },
}));

export default function Page({ page }) {
  const classes = useStyles();
  const theme = useTheme();
  const fullHead = parse(page.seo.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-'));

  if (!page) {
    return (
      <DefaultErrorPage />
    );
  }

  return (
    <div className={classes.container}>
      <Head>
        <title>
          { page.seo.title }
        </title>
        { fullHead }
      </Head>
      <CustomPage page={page} />
    </div>
  );
}

export const getServerSideProps = async () => {
  let res = {};
  try {
    const data = await WPGraphQL.request(
      gql`
        query Terms {
          page(id: "terms-and-conditions", idType: URI) {
            content
            title
            date
            seo {
              fullHead
              title
            }
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
      return { props: { page: res } };
    }
  }
  return { props: { page: null } };
};
