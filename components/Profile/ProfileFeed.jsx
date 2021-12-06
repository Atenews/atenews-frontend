import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import ClockIcon from '@mui/icons-material/AccessTime';
import LikeIcon from '@mui/icons-material/ArrowUpwardRounded';
import DislikeIcon from '@mui/icons-material/ArrowDownwardRounded';
import CommentIcon from '@mui/icons-material/CommentOutlined';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import imageGenerator from '@/utils/imageGenerator';
import slugGenerator from '@/utils/slugGenerator';

import firebase from '@/utils/firebase';

import { formatDistanceToNow } from 'date-fns';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';

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

  const [feedStats, setFeedStats] = React.useState(null);
  const [article, setArticle] = React.useState(null);
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
    firebase.database().ref(`articles/${comment.articleSlug}`).once('value').then((doc) => {
      const ret = { ...doc.val() };
      const backup = ret.categories;

      if (ret.categories) {
        ret.categories = Object.keys(backup).map((keyCat) => backup[keyCat]);
      }
      setArticle(ret);
    });
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

  if (!feedStats || !article) {
    return (
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <CircularProgress color="primary" style={{ margin: theme.spacing(2) }} />
        </Grid>
      </Grid>
    );
  }

  return (
    <CardActionArea
      onClick={() => router.push(slugGenerator({
        categories_detailed: article.categories,
        slug: comment.articleSlug,
      }))}
      style={{ marginTop: theme.spacing(1) }}
    >
      <Paper variant="outlined" className={classes.trendingItem}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          {'upvoteCount' in feedStats ? (
            <Grid item>
              <Grid container direction="column" style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }} alignItems="center">
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
                  style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}
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
                <Grid container spacing={1} wrap="nowrap" style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>
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
            <LazyLoadImage src={imageGenerator(comment.featured_image_src, 400)} alt="Profile" width="100%" effect="opacity" />
          </Grid>
        </Grid>
      </Paper>
    </CardActionArea>
  );
};

export default ProfileFeed;
