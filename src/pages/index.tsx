import React from 'react';

import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Head from 'next/head';
import parse from 'html-react-parser';

import { LazyLoadComponent } from 'react-lazy-load-image-component';

import Typography from '@mui/material/Typography';

import RecentArticles from '@/components/Home/RecentArticles';

import { appRouter } from '@/server/routers/_app';
import { GetServerSideProps, NextPage } from 'next';

const Title = dynamic(import('@/components/Home/Title'));

const ArticleGrid = dynamic(import('@/components/Home/ArticleGrid'));

const EditorialColumn = dynamic(import('@/components/Home/EditorialColumn'));
const Hulagway = dynamic(import('@/components/Home/Hulagway'));
const LatestRelease = dynamic(import('@/components/Home/LatestRelease'));

const useStyles = makeStyles((theme) => ({
  container: {
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    height: 65,
    padding: 5,
  },
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
  section: {
    marginTop: 80,
  },
}));

interface Props {
  recentArticles: Article[];
  news: Article[];
  features: Article[];
  featuredPhoto: Article;
  editorial: Article;
  columns: Article[];
  homepage: {
    seo: {
      title: string;
      fullHead: string;
    };
  };
}

const Home: NextPage<Props> = ({
  recentArticles,
  news,
  features,
  featuredPhoto,
  editorial,
  columns,
  homepage,
}) => {
  const classes = useStyles();
  const fullHead = parse(homepage.seo.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-'));
  const theme = useTheme();

  return (
    <div className={classes.container}>
      <Head>
        <title>
          { homepage.seo.title }
        </title>
        { fullHead }
      </Head>
      <div className={classes.header}>
        <img src={theme.palette.mode === 'dark' ? '/atenews-footer.svg' : '/atenews-header.svg'} alt="Atenews Header" height="35" />
        <Typography variant="subtitle2" style={{ fontSize: '0.7rem' }}>
          The official student publication of the Ateneo de Davao University
        </Typography>
      </div>
      { /* TODO: Add trending */}
      <RecentArticles articles={recentArticles} />
      <LazyLoadComponent>
        <div className={classes.section}>
          <Title color={theme.palette.atenews.news}>News</Title>
          <ArticleGrid articles={news} />
        </div>
      </LazyLoadComponent>

      <LazyLoadComponent>
        <div className={classes.section}>
          <Title color={theme.palette.atenews.features}>Features</Title>
          <ArticleGrid articles={features} />
        </div>
      </LazyLoadComponent>

      <LazyLoadComponent>
        <Hulagway featuredPhoto={featuredPhoto} />
      </LazyLoadComponent>

      <LazyLoadComponent>
        <EditorialColumn editorial={editorial} columns={columns} />
      </LazyLoadComponent>

      <LazyLoadComponent>
        <LatestRelease />
      </LazyLoadComponent>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const caller = appRouter.createCaller({ req, res });

  try {
    const homeResult = await caller.home();

    return {
      props: homeResult,
    };
  } catch (err) {
    return {
      props: {
        recentArticles: [], news: [], features: [], featuredPhoto: {}, editorial: {}, columns: [],
      },
    };
  }
};

export default Home;
