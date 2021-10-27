import React from 'react';

import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Head from 'next/head';
import parse from 'html-react-parser';

import { LazyLoadComponent } from 'react-lazy-load-image-component';

import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

import { useTrending } from '@/utils/hooks/useTrending';
import { useAuth } from '@/utils/hooks/useAuth';
import { useRouter } from 'next/router';
import { useError } from '@/utils/hooks/useSnackbar';
import firebase from '@/utils/firebase';

import {
  Typography, Grid,
} from '@mui/material';

import RecentArticles from '@/components/Home/RecentArticles';

const Title = dynamic(import('@/components/Home/Title'));

const ArticleGrid = dynamic(import('@/components/Home/ArticleGrid'));
const Trending = dynamic(import('@/components/Home/Trending'));

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

export default function Home({
  recentArticles,
  news,
  features,
  featuredPhoto,
  editorial,
  columns,
  mode,
  oobCode,
  continueUrl,
  homepage,
}) {
  const classes = useStyles();
  const fullHead = parse(homepage.seo.fullHead.replace('https://atenews.ph/wp-', 'https://wp.atenews.ph/wp-'));
  const theme = useTheme();
  const trending = useTrending();
  const {
    loadingAuth,
  } = useAuth();
  const router = useRouter();

  const { setSuccess, setError } = useError();

  React.useEffect(() => {
    if (mode && oobCode) {
      switch (mode) {
        case 'resetPassword':
          // Display reset password handler and UI.
          router.push(`/reset-password?mode=${mode}&oobCode=${oobCode}`);
          break;
        case 'recoverEmail':
          // Display email recovery handler and UI.
          setError('Email recovery has not been implemented yet! Please contact us at dev@atenews.ph for urgent matters.');
          break;
        case 'verifyEmail':
          // Display email verification handler and UI.
          firebase.auth().applyActionCode(oobCode).then(async () => {
            setSuccess('Successfully verified email!');
            if (continueUrl) {
              router.push(continueUrl);
            }
          }).catch((err) => {
            setError(err.message);
          });
          break;
        default:
          // Error: invalid mode.
          break;
      }
    }
  }, [setSuccess, mode, oobCode]);

  return (
    <div className={classes.container}>
      <Head>
        <title>
          { homepage.seo.title }
        </title>
        { fullHead }
      </Head>
      { !loadingAuth ? (
        <>
          <div className={classes.header}>
            <img src={theme.palette.mode === 'dark' ? '/atenews-footer.svg' : '/atenews-header.svg'} alt="Atenews Header" height="35" />
            <Typography variant="subtitle2" style={{ fontSize: '0.7rem' }}>
              The official student publication of the Ateneo de Davao University
            </Typography>
          </div>
          <Trending articles={trending} />
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

export async function getServerSideProps({ query }) {
  try {
    if ((query ? query.mode : null) === 'resetPassword') {
      return {
        redirect: {
          permanent: false,
          destination: `/reset-password?mode=${query.mode}&oobCode=${query.oobCode}`,
        },
      };
    }
    const data = await WPGraphQL.request(
      gql`
        query Home {
          home: homepage {
            seo {
              fullHead
            }
          }
          recentArticles: posts(first: 5) {
            nodes {
              title(format: RENDERED)
              slug
              date
              postViews
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                }
              }
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              databaseId
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
            }
          }
          news: posts(first: 5, where: { categoryName: "news" }) {
            nodes {
              title(format: RENDERED)
              slug
              date
              postViews
              databaseId
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              excerpt
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                }
              }
            }
          }
          features: posts(first: 5, where: { categoryName: "features" }) {
            nodes {
              title(format: RENDERED)
              slug
              date
              postViews
              databaseId
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              excerpt
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                }
              }
            }
          }
          featuredPhoto: posts(first: 1, where: { categoryName: "featured-photos" }) {
            nodes {
              databaseId
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
              content
              excerpt
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                }
              }
            }
          }
          editorial: posts(first: 1, where: { categoryName: "editorial" }) {
            nodes {
              title(format: RENDERED)
              databaseId
              date
              slug
              postViews
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
              excerpt
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                }
              }
            }
          }
          columns: posts(first: 4, where: { categoryName: "columns" }) {
            nodes {
              title(format: RENDERED)
              databaseId
              date
              slug
              postViews
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              coauthors {
                nodes {
                  firstName
                  lastName
                  databaseId
                  avatar {
                    url
                  }
                }
              }
            }
          }
        }        
      `,
    );
    return {
      props: {
        recentArticles: data.recentArticles.nodes,
        news: data.news.nodes,
        features: data.features.nodes,
        featuredPhoto: data.featuredPhoto.nodes[0],
        editorial: data.editorial.nodes[0],
        columns: data.columns.nodes,
        homepage: data.home,
        mode: 'mode' in query ? query.mode : null,
        oobCode: 'oobCode' in query ? query.oobCode : null,
        continueUrl: 'continueUrl' in query ? query.continueUrl : null,
      },
    };
  } catch (err) {
    return {
      props: {
        recentArticles: [], news: [], features: [], featuredPhoto: {}, editorial: {}, columns: [],
      },
    };
  }
}
