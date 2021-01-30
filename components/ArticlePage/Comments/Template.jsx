import React from 'react';

import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { formatDistanceToNow } from 'date-fns';

import LikeIcon from '@material-ui/icons/ArrowUpwardRounded';
import DislikeIcon from '@material-ui/icons/ArrowDownwardRounded';
import CommentIcon from '@material-ui/icons/CommentOutlined';

import Button from '@/components/General/Button';
import Flair from '@/components/Social/Flair';
import Link from '@/components/General/Link';
import Options from '@/components/ArticlePage/Comments/Options';

import {
  Typography,
  Avatar,
  Grid,
  Paper as StockPaper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

import imageGenerator from '@/utils/imageGenerator';
import firebase from '@/utils/firebase';
import { useAuth } from '@/utils/hooks/useAuth';
import { useError } from '@/utils/hooks/useSnackbar';
import { useArticle } from '@/utils/hooks/useArticle';

const Paper = withStyles((theme) => ({
  root: {
    borderRadius: 30,
    backgroundColor: theme.palette.type === 'light' ? '#F0F2F5' : theme.palette.background.paper,
    padding: theme.spacing(2),
  },
}))(StockPaper);

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

const CommentReplyTemplate = ({
  children,
  reply,
  details,
  getReplies,
  slug,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const {
    users: { users },
    comments: {
      commentsSocialStats, setCommentSocialStats,
    },
    replies: { repliesSocialStats, setRepliesSocialStats },
  } = useArticle();
  const { profile, authUser } = useAuth();
  const { setError, setSuccess } = useError();

  const [vote, setVote] = React.useState(null);

  React.useEffect(() => {
    let unsub = () => { };
    if (profile) {
      unsub = firebase.firestore().collection('votes').doc(`${details.id}_${profile.id}`).onSnapshot(async (snapshot) => {
        if (snapshot.exists) {
          setVote(snapshot.data().content);
        } else {
          setVote(null);
        }
      });
    }

    return () => {
      unsub();
    };
  }, []);

  const handleVote = async (voteHandle) => {
    if (!authUser) {
      setError('You need to be logged in to do this action!');
      return;
    }

    if (!authUser.emailVerified) {
      setError('A verified email is required to do this action!');
      return;
    }
    try {
      if (vote !== voteHandle) {
        let data = {
          articleSlug: slug,
          commenterId: details.userId,
          content: voteHandle,
          timestamp: new Date(),
          userId: profile.id,
        };
        if (!reply) {
          data = { ...data, commentId: details.id };
          if (vote !== null) {
            setCommentSocialStats((prev) => ({
              ...prev,
              [details.id]: {
                ...prev[details.id],
                [`${vote}voteCount`]: prev[details.id][`${vote}voteCount`] - 1,
                [`${voteHandle}voteCount`]: prev[details.id][`${voteHandle}voteCount`] + 1,
              },
            }));
          } else {
            setCommentSocialStats((prev) => ({
              ...prev,
              [details.id]: {
                ...prev[details.id],
                [`${voteHandle}voteCount`]: prev[details.id][`${voteHandle}voteCount`] + 1,
              },
            }));
          }
        } else {
          data = { ...data, replyId: details.id };
          if (vote !== null) {
            setRepliesSocialStats((prev) => ({
              ...prev,
              [details.id]: {
                ...prev[details.id],
                [`${vote}voteCount`]: prev[details.id][`${vote}voteCount`] - 1,
                [`${voteHandle}voteCount`]: prev[details.id][`${voteHandle}voteCount`] + 1,
              },
            }));
          } else {
            setRepliesSocialStats((prev) => ({
              ...prev,
              [details.id]: {
                ...prev[details.id],
                [`${voteHandle}voteCount`]: prev[details.id][`${voteHandle}voteCount`] + 1,
              },
            }));
          }
        }

        await firebase.firestore().collection('votes').doc(`${details.id}_${profile.id}`).set(data);
      } else {
        if (!reply) {
          setCommentSocialStats((prev) => ({
            ...prev,
            [details.id]: {
              ...prev[details.id],
              [`${vote}voteCount`]: prev[details.id][`${vote}voteCount`] - 1,
            },
          }));
        } else {
          setRepliesSocialStats((prev) => ({
            ...prev,
            [details.id]: {
              ...prev[details.id],
              [`${vote}voteCount`]: prev[details.id][`${vote}voteCount`] - 1,
            },
          }));
        }

        await firebase.firestore().collection('votes').doc(`${details.id}_${profile.id}`).delete();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentDelete = async () => {
    try {
      await firebase.firestore().collection('comments').doc(details.id).delete();
      setSuccess('Successfully deleted comment!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReplyDelete = async () => {
    try {
      await firebase.firestore().collection('replies').doc(details.id).delete();
      setSuccess('Successfully deleted reply!');
    } catch (err) {
      setError(err.message);
    }
  };

  const isOwner = () => {
    if (profile) {
      if (details.userId === profile.id) {
        return true;
      }
    }
    return false;
  };

  return (
    <ListItem style={{ padding: 0 }} alignItems="flex-start" component="div">
      <ListItemAvatar>
        <Avatar
          className={reply ? classes.avatarReply : classes.avatar}
          src={imageGenerator(users[details.userId].photoURL, 60)}
        />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <>
            <ListItem style={{ padding: 0 }}>
              <Paper elevation={0} style={{ width: 'fit-content', maxWidth: '80%' }}>
                <Grid container spacing={1} style={{ marginBottom: theme.spacing(0.5) }}>
                  <Grid item>
                    <Typography variant="body2"><Link href={`/profile/${users[details.userId].username}`}><b>{users[details.userId].displayName}</b></Link></Typography>
                  </Grid>
                  { users[details.userId].staff ? (
                    <Grid item xs>
                      <Flair small />
                    </Grid>
                  ) : null }
                </Grid>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="body1">{details.content}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption"><i>{formatDistanceToNow(new Date(details.timestamp.toDate() || null), { addSuffix: true })}</i></Typography>
                  </Grid>
                </Grid>
              </Paper>
              {isOwner() ? (
                <Options onDelete={reply ? handleReplyDelete : handleCommentDelete} />
              ) : null}
            </ListItem>
          </>
        )}
        secondary={(
          <div style={{ marginTop: theme.spacing(1) }}>
            <Grid container spacing={1} style={{ color: theme.palette.primary.main }}>
              <Grid item>
                <Button
                  variant={vote === 'up' ? 'contained' : 'text'}
                  style={{ padding: 0 }}
                  color={theme.palette.type === 'light' ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => { handleVote('up'); }}
                  disabled={!profile}
                >
                  <LikeIcon style={{ marginRight: theme.spacing(1) }} />
                  {reply ? (
                    repliesSocialStats[details.id].upvoteCount || 0
                  ) : (
                    commentsSocialStats[details.id].upvoteCount || 0
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={vote === 'down' ? 'contained' : 'text'}
                  style={{ padding: 0 }}
                  color={theme.palette.type === 'light' ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => { handleVote('down'); }}
                  disabled={!profile}
                >
                  <DislikeIcon style={{ marginRight: theme.spacing(1) }} />
                  {reply ? (
                    repliesSocialStats[details.id].downvoteCount || 0
                  ) : (
                    commentsSocialStats[details.id].downvoteCount || 0
                  )}
                </Button>
              </Grid>
              {!reply ? (
                <Grid item>
                  { profile || commentsSocialStats[details.id].replyCount > 0 ? (
                    <Button
                      style={{ padding: 0 }}
                      variant="text"
                      color={theme.palette.type === 'light' ? 'primary' : 'secondary'}
                      size="small"
                      onClick={getReplies}
                    >
                      <CommentIcon style={{ marginRight: theme.spacing(1) }} />
                      {commentsSocialStats[details.id].replyCount > 0 ? `View ${commentsSocialStats[details.id].replyCount} replies` : 'Reply'}
                    </Button>
                  ) : null }
                </Grid>
              ) : null}
            </Grid>
            { children ? (
              <List>
                {children}
              </List>
            ) : null }
          </div>
        )}
        style={{ paddingLeft: theme.spacing(1) }}
        disableTypography
      />
    </ListItem>
  );
};

export default CommentReplyTemplate;
