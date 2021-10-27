import React from 'react';

import dynamic from 'next/dynamic';

import { NextSeo } from 'next-seo';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import DefaultErrorPage from '@/components/404';

import {
  Grid,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';

import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

import { useError } from '@/utils/hooks/useSnackbar';
import { useAuth } from '@/utils/hooks/useAuth';
import { useTrending } from '@/utils/hooks/useTrending';
import firebaseAdmin from '@/utils/firebaseAdmin';
import firebase from '@/utils/firebase';
import postFetch from '@/utils/postFetch';

import SwipeableViews from 'react-swipeable-views';
import InfiniteScroll from 'react-infinite-scroll-component';

const ProfileFeed = dynamic(import('@/components/Profile/ProfileFeed'));
const Trending = dynamic(import('@/components/Home/Trending'));
const ConnectButtons = dynamic(import('@/components/Profile/ConnectButtons'));
const ShowDetails = dynamic(import('@/components/Profile/ShowDetails'));
const EditDetails = dynamic(import('@/components/Profile/EditDetails'));
const EditProfileButton = dynamic(import('@/components/Profile/EditProfileButton'));
const SocialMediaDetails = dynamic(import('@/components/Profile/SocialMediaDetails'));
const Article = dynamic(import('@/components/List/Article'));

const DisplayAvatar = dynamic(import('@/components/Profile/DisplayAvatar'));

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 80,
    minHeight: 800,
  },
  iconStats: {
    width: 'fit-content',
    marginRight: theme.spacing(4),
  },
  section: {
    marginTop: theme.spacing(4),
  },
  avatar: {
    height: 250,
    width: 250,
    backgroundColor: theme.palette.primary.main,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  threeLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
}));

export default function Home({ profile, cdnKey, staffArticles }) {
  const classes = useStyles();
  const theme = useTheme();
  const trending = useTrending();

  const {
    profile: authProfile,
    loadingAuth,
  } = useAuth();
  const { setError } = useError();

  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);

  const [displayName, setDisplayName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [backup, setBackup] = React.useState({
    displayName: '',
    username: '',
    bio: '',
    email: '',
  });

  const [startAt, setStartAt] = React.useState(null);
  const [hasMore, setHasMore] = React.useState(true);

  const [articles, setArticles] = React.useState(staffArticles?.articlesRaw);
  const [hasMoreArticles, setHasMoreArticles] = React.useState(true);
  const [cursor, setCursor] = React.useState(null);

  React.useEffect(() => {
    setArticles(staffArticles?.articlesRaw);
    setCursor(staffArticles?.pageInfo?.endCursor);
    setHasMoreArticles(staffArticles?.pageInfo?.hasNextPage);
  }, [staffArticles]);

  const nextArticles = () => {
    postFetch('/api/graphql/getAuthorArticles', {
      authorId: staffArticles?.wpId,
      cursor,
    }).then((res) => res.json()).then((x) => {
      setHasMore(x.pageInfo.hasNextPage);
      setCursor(x.pageInfo.endCursor);
      setArticles([...articles, ...x.articlesRaw]);
    });
  };

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabChangeIndex = (index) => {
    setTabValue(index);
  };

  const TabPanel = (props) => {
    const {
      children, value, index, ...other
    } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <>
            { children }
          </>
        )}
      </div>
    );
  };

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setUsername(profile.username);
      setBio(profile.bio);
      setEmail(profile.email);

      firebase.firestore().collection('users')
        .doc(profile.id)
        .collection('profileFeeds')
        .orderBy('timestamp', 'desc')
        .limit(6)
        .get()
        .then(async (doc) => {
          setStartAt(doc.docs[doc.docs.length - 1]);
          const arrayList = [];
          if (!doc.empty) {
            let i = 0;
            doc.forEach((feed) => {
              if (i < 5) {
                arrayList.push(feed.data());
              }
              i += 1;
            });
          }
          setLoading(false);
          setComments(arrayList);
          if (doc.docs.length < 6) {
            setHasMore(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    } else {
      setError('User not found!');
    }
  }, [profile]);

  const next = () => {
    if (startAt) {
      firebase.firestore().collection('users')
        .doc(profile.id)
        .collection('profileFeeds')
        .orderBy('timestamp', 'desc')
        .limit(6)
        .startAt(startAt)
        .get()
        .then(async (doc) => {
          setStartAt(doc.docs[doc.docs.length - 1]);
          const arrayList = [];
          if (!doc.empty) {
            let i = 0;
            doc.forEach((feed) => {
              if (i < 5) {
                arrayList.push(feed.data());
              }
              i += 1;
            });
            if (doc.docs.length < 6) {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
          setComments((prev) => [...prev, ...arrayList]);
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setHasMore(false);
    }
  };

  const WrittenArticles = () => {
    if (!articles?.length) {
      return (
        <Grid
          container
          direction="column"
          spacing={0}
          alignItems="center"
          justifyContent="center"
          style={{ marginTop: theme.spacing(4) }}
        >
          <Grid item>
            <img src="/reacts/sad.svg" alt="sad" width={40} />
          </Grid>
          <Grid item>
            <Typography variant="body1">Nothing to see here!</Typography>
          </Grid>
        </Grid>
      );
    }
    return (
      <InfiniteScroll
        dataLength={articles?.length || 0}
        next={nextArticles}
        hasMore={hasMoreArticles}
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
        { articles?.map((article, index) => (
          <Article key={index} article={article} />
        ))}
      </InfiniteScroll>
    );
  };

  const RecentActivities = () => {
    if (!comments?.length) {
      return (
        <Grid
          container
          direction="column"
          spacing={0}
          alignItems="center"
          justifyContent="center"
          style={{ marginTop: theme.spacing(4) }}
        >
          <Grid item>
            <img src="/reacts/sad.svg" alt="sad" width={40} />
          </Grid>
          <Grid item>
            <Typography variant="body1">Nothing to see here!</Typography>
          </Grid>
        </Grid>
      );
    }
    return (
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={comments?.length || 0}
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
        {comments?.map((comment) => (
          <ProfileFeed key={comment.id} comment={comment} />
        ))}
      </InfiniteScroll>
    );
  };

  if (profile) {
    return (
      <div className={classes.container} key={profile.username}>
        <NextSeo
          title={`${profile.displayName} (@${profile.username}) - Atenews`}
          description={`The latest interactions from ${profile.displayName} (@${profile.username}). Join us here in the Atenews website!`}
          openGraph={{
            title: `${profile.displayName} (@${profile.username}) - Atenews`,
            description: `The latest interactions from ${profile.displayName} (@${profile.username}). Join us here in the Atenews website!`,
            images: profile.photoURL ? [
              {
                url: profile.photoURL.replace('_normal', ''),
              },
            ] : [{
              url: '/default-thumbnail.jpg',
            }],
          }}
          twitter={{
            handle: '@atenews',
          }}
        />
        { !loadingAuth ? (
          <>
            <Grid container spacing={6} justifyContent="center">
              <Grid item>
                <DisplayAvatar editMode={editMode} profile={profile} cdnKey={cdnKey} />
              </Grid>
              <Grid item xs>
                {editMode ? (
                  <EditDetails
                    profile={profile}
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    username={username}
                    setUsername={setUsername}
                    bio={bio}
                    setBio={setBio}
                    email={email}
                    setEmail={setEmail}
                  />
                ) : (
                  <ShowDetails
                    profile={profile}
                    displayName={displayName}
                    username={username}
                    bio={bio}
                    email={email}
                  />
                )}
                {authProfile && authProfile.id === profile.id ? (
                  <>
                    <ConnectButtons loading={loading} profile={profile} />
                    <EditProfileButton
                      profile={profile}
                      displayName={displayName}
                      username={username}
                      backup={backup}
                      bio={bio}
                      email={email}
                      setBackup={setBackup}
                      setDisplayName={setDisplayName}
                      setUsername={setUsername}
                      setBio={setBio}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      editMode={editMode}
                      setEditMode={setEditMode}
                    />
                  </>
                ) : (
                  <SocialMediaDetails profile={profile} />
                )}
              </Grid>
            </Grid>
            <Divider style={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }} />
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="default"
              centered
              style={{ marginBottom: theme.spacing(2) }}
            >
              { profile.staff ? (
                <Tab label="Written Articles" />
              ) : null}
              <Tab label="Recent Activities" />
            </Tabs>
            { profile.staff ? (
              <SwipeableViews
                index={tabValue}
                onChangeIndex={handleTabChangeIndex}
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              >
                <TabPanel value={tabValue} index={0} dir={theme.direction}>
                  <WrittenArticles />
                </TabPanel>
                <TabPanel value={tabValue} index={1} dir={theme.direction}>
                  <>
                    { !loading ? (
                      <RecentActivities />
                    ) : (
                      <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item>
                          <CircularProgress color="primary" style={{ margin: theme.spacing(2) }} />
                        </Grid>
                      </Grid>
                    ) }
                  </>
                </TabPanel>
              </SwipeableViews>
            ) : (
              <TabPanel value={tabValue} index={0} dir={theme.direction}>
                <>
                  { !loading ? (
                    <RecentActivities />
                  ) : (
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                      <Grid item>
                        <CircularProgress color="primary" style={{ margin: theme.spacing(2) }} />
                      </Grid>
                    </Grid>
                  ) }
                </>
              </TabPanel>
            ) }
            <Trending articles={trending} />
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

  return (
    <DefaultErrorPage />
  );
}

export async function getServerSideProps({ params }) {
  try {
    const snapshot = await firebaseAdmin.firestore().collection('users').where('username', '==', params.username).get();
    const keySnapshot = await firebaseAdmin.firestore().collection('keys').doc('custom').get();
    let wpData = null;
    let wpId = null;
    if (!snapshot.empty) {
      if (snapshot.docs[0].data().staff) {
        const wpSnapshot = await firebaseAdmin.firestore().collection('wordpress').where('id', '==', snapshot.docs[0].id).get();
        if (!wpSnapshot.empty) {
          wpId = wpSnapshot.docs[0].id;
          wpData = await WPGraphQL.request(
            gql`
              query Articles {
                posts(first: 5, where: { author: ${wpId} }) {
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                  }
                  nodes {
                    title(format: RENDERED)
                    slug
                    date
                    coauthors {
                      nodes {
                        firstName
                        lastName
                        databaseId
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
                    databaseId
                    featuredImage {
                      node {
                        sourceUrl(size: LARGE)
                      }
                    }
                  }
                }
              }            
            `,
          );
        }
      }
      return {
        props: {
          profile: {
            ...snapshot.docs[0].data(),
            id: snapshot.docs[0].id,
          },
          staffArticles: {
            articlesRaw: wpData ? wpData.posts.nodes : null,
            wpId,
            pageInfo: wpData ? wpData.posts.pageInfo : null,
          },
          cdnKey: keySnapshot.data().cdn,
        },
      };
    }

    return {
      notFound: true,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
