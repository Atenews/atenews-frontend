import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import ClockIcon from '@material-ui/icons/AccessTime';

import LikeIcon from '@material-ui/icons/ArrowUpwardRounded';
import DislikeIcon from '@material-ui/icons/ArrowDownwardRounded';
import CommentIcon from '@material-ui/icons/CommentOutlined';

import imageGenerator from '@/utils/imageGenerator';
import slugGenerator from '@/utils/slugGenerator';

import useFirestore from '@/utils/hooks/useFirestore';

import { formatDistanceToNow } from 'date-fns';

import {
  Typography, Paper, Grid, CardActionArea, CircularProgress, Avatar,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  trendingItem: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
  },
  trendingStats: {
    width: '100%',
    color: theme.palette.primary.main,
    padding: theme.spacing(0.5),
  },
  trendingStatsText: {
    fontSize: '0.8rem',
  },
  oneLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  twoLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  threeLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  avatar: {
    height: 100,
    width: 100,
  },
  buttonReacts: {
    width: 23,
    height: 32,
    backgroundColor: 'transparent',
    overflow: 'visible',
    border: 0,
  },
}));

const ProfileFeed = ({ comment }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const { firebase } = useFirestore();

  const [feedStats, setFeedStats] = React.useState(null);
  const [description, setDescription] = React.useState('');

  const ReactContent = () => {
    switch (comment.content) {
      case 'happy':
        return <Avatar className={classes.buttonReacts} style={{ marginRight: theme.spacing(1) }} src="/reacts/happy.svg" />;
      case 'sad':
        return <Avatar className={classes.buttonReacts} style={{ marginRight: theme.spacing(1) }} src="/reacts/sad.svg" />;
      case 'angry':
        return <Avatar className={classes.buttonReacts} style={{ marginRight: theme.spacing(1) }} src="/reacts/angry.svg" />;
      case 'disgust':
        return <Avatar className={classes.buttonReacts} style={{ marginRight: theme.spacing(1) }} src="/reacts/disgust.svg" />;
      case 'worried':
        return <Avatar className={classes.buttonReacts} style={{ marginRight: theme.spacing(1) }} src="/reacts/worried.svg" />;
      default:
        return null;
    }
  };

  React.useEffect(() => {
    switch (comment.type) {
      case 'comment':
        setDescription('Made a comment on ');
        firebase.firestore().collection('comments').doc(comment.id).get()
          .then((doc) => {
            if (doc.exists) {
              setFeedStats(doc.data());
            }
          });
        break;
      case 'reply':
        setDescription('Made a reply on ');
        firebase.firestore().collection('replies').doc(comment.id).get()
          .then((doc) => {
            if (doc.exists) {
              setFeedStats(doc.data());
            }
          });
        break;
      case 'react':
        setDescription('Reacted on ');
        firebase.firestore().collection('reacts').doc(comment.id).get()
          .then((doc) => {
            if (doc.exists) {
              setFeedStats(doc.data());
            }
          });
        break;
      default:
    }
  }, []);

  if (!feedStats) {
    return (
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <CircularProgress color="primary" style={{ margin: theme.spacing(2) }} />
        </Grid>
      </Grid>
    );
  }

  return (
    <CardActionArea
      onClick={() => router.push(slugGenerator({
        categories_detailed: comment.article.categories,
        slug: comment.articleSlug,
      }))}
      style={{ marginTop: theme.spacing(1) }}
    >
      <Paper variant="outlined" className={classes.trendingItem}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          {'upvoteCount' in feedStats ? (
            <Grid item>
              <Grid container direction="column" style={{ color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white' }} alignItems="center">
                <Grid item>
                  <Typography variant="subtitle2">{feedStats.upvoteCount}</Typography>
                </Grid>
                <Grid item>
                  <LikeIcon />
                </Grid>
                <Grid item>
                  <DislikeIcon />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">{feedStats.downvoteCount}</Typography>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
          <Grid item xs>
            <Grid container spacing={1}>
              <Grid item sm={12}>
                <Grid
                  container
                  spacing={1}
                  wrap="nowrap"
                  style={{ color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white' }}
                  alignItems="center"
                >
                  <Grid item>
                    {comment.type !== 'react' ? (
                      <CommentIcon />
                    ) : (
                      <ReactContent />
                    )}
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" className={classes.oneLineText}>
                      {description}
                      <i>{comment.title}</i>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12}>
                <Grid container spacing={1} wrap="nowrap" style={{ color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white' }}>
                  <Grid item>
                    <ClockIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">{ formatDistanceToNow(comment.timestamp.toDate(), { addSuffix: true }) }</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            { comment.type !== 'react' ? (
              <Typography style={{ marginLeft: theme.spacing(2), marginTop: theme.spacing(1) }} className={classes.oneLineText} variant="body1">{comment.content}</Typography>
            ) : null}
          </Grid>
          <Grid item xs={3}>
            <img src={imageGenerator(comment.featured_image_src, 400)} alt="Profile" width="100%" />
          </Grid>
        </Grid>
      </Paper>
    </CardActionArea>
  );
};

export default ProfileFeed;
