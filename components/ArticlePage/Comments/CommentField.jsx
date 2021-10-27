import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';

import { useAuth } from '@/utils/hooks/useAuth';
import { useError } from '@/utils/hooks/useSnackbar';
import firebase from '@/utils/firebase';
import imageGenerator from '@/utils/imageGenerator';

import { Send as SendIcon } from '@mui/icons-material';
import { isMobile } from 'react-device-detect';

import localforage from 'localforage';

import {
  IconButton,
  Avatar,
  TextField as StockTextField,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Grid,
  Typography,
} from '@mui/material';

const TextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 30,
      },
    },
  },
})(StockTextField);

const useStyles = makeStyles(() => ({
  avatar: {
    height: 60,
    width: 60,
  },
  avatarReply: {
    height: 50,
    width: 50,
  },
}));

export default function Page({ reply, slug, rootDetails }) {
  const classes = useStyles();
  const theme = useTheme();
  const { profile, authUser } = useAuth();
  const { setError } = useError();

  const [content, setContent] = React.useState('');
  const inputRef = React.useRef();

  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timer, setTimer] = React.useState(3);
  const [interval, setIntervalState] = React.useState(null);

  const initiateTimer = () => {
    setTimerRunning(true);
    const temp = setInterval(() => {
      if (timer !== 0) {
        setTimer((prev) => prev - 1);
      }
    }, 1000);
    setIntervalState(temp);
  };

  React.useEffect(() => {
    localforage.getItem(`commentTimer_${rootDetails?.id}`).then((state) => {
      if (state) {
        setTimer(state);
      }
    });
    localforage.getItem(`commentTimerRunning_${rootDetails?.id}`).then((state) => {
      setTimerRunning(state);
      if (state) {
        initiateTimer();
      }
    });
  }, []);

  React.useEffect(() => {
    if (timer === 0) {
      clearInterval(interval);
      setTimerRunning(false);
      setContent('');
      setTimer(3);
    }
    localforage.setItem(`commentTimer_${rootDetails?.id}`, timer);
  }, [timer]);

  React.useEffect(() => {
    localforage.setItem(`commentTimerRunning_${rootDetails?.id}`, timerRunning);
  }, [timerRunning]);

  React.useEffect(() => {
    setContent('');
  }, [slug]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (authUser) {
      if (authUser.emailVerified) {
        if (content.trim()) {
          await firebase.firestore().collection('comments').add({
            articleSlug: slug,
            content,
            downvoteCount: 0,
            replyCount: 0,
            socialScore: 0,
            timestamp: new Date(),
            upvoteCount: 0,
            userId: profile.id,
          });
          initiateTimer();
          setContent('You may comment again after 3 seconds.');
        }
      } else {
        setError('A verified email is required to do this action!');
      }
    } else {
      setError('You need to be logged in to do this action!');
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (authUser) {
      if (authUser.emailVerified) {
        if (content.trim()) {
          await firebase.firestore().collection('replies').add({
            articleSlug: slug,
            commentId: rootDetails.id,
            content,
            downvoteCount: 0,
            timestamp: new Date(),
            upvoteCount: 0,
            userId: profile.id,
          });
          initiateTimer();
          setContent('You may reply again after 3 seconds.');
        }
      } else {
        setError('A verified email is required to do this action!');
      }
    } else {
      setError('You need to be logged in to do this action!');
    }
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.charCode === 13) {
      if (!event.shiftKey && !isMobile) {
        if (reply) {
          submitReply(event);
        } else {
          submitComment(event);
        }
      }
    }
  };

  if (!profile) {
    return (
      <Grid
        container
        direction="column"
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ marginBottom: theme.spacing(4) }}
      >
        <Grid item>
          <Typography variant="body1">Sign up/Log in to post a comment and join the discussion!</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <ListItem style={{ padding: 0, marginBottom: reply ? 0 : theme.spacing(2) }}>
      <ListItemIcon>
        <Avatar
          src={imageGenerator(profile.photoURL, 60)}
          className={reply ? classes.avatarReply : classes.avatar}
        />
      </ListItemIcon>
      <ListItemText
        primary={(
          <form onSubmit={reply ? submitReply : submitComment}>
            <TextField
              ref={inputRef}
              disabled={timerRunning}
              variant="outlined"
              placeholder={reply ? 'Write a reply...' : 'Write a comment...'}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              value={content}
              multiline
              rows={1}
              maxRows={5}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton type="submit" size="large">
                      <SendIcon color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        )}
        style={{ paddingLeft: theme.spacing(1) }}
        disableTypography
      />
    </ListItem>
  );
}
