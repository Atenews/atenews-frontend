import React from 'react';

import { appRouter } from '@/server/routers/_app';

import Head from 'next/head';
import parse from 'html-react-parser';

import { makeStyles } from '@mui/styles';

import CustomPage from '@/components/CustomPage';

import DefaultErrorPage from '@/components/404';
import { GetServerSideProps, NextPage } from 'next';
import type { Query } from '@/server/routers/customPage';

const useStyles = makeStyles(() => ({
  contentContainer: {
    width: '90%',
    margin: 'auto',
  },
}));

const PrivacyPolicy: NextPage<Query> = ({ page }) => {
  const classes = useStyles();
  const fullHead = parse(page.seo.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-'));

  if (!page) {
    return (
      <DefaultErrorPage />
    );
  }

  return (
    <div className={classes.contentContainer}>
      <Head>
        <title>
          { page.seo.title }
        </title>
        { fullHead }
      </Head>
      <CustomPage page={page} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const caller = appRouter.createCaller({ req, res });

  try {
    const page = await caller.customPage({ slug: 'privacy-policy' });
    if (page) {
      if ('content' in page) {
        return { props: { page } };
      }
    }
  } catch (e) {
    return { props: { page: null } };
  }

  return { props: { page: null } };
};

export default PrivacyPolicy;
