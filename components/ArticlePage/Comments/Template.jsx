import React from 'react';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { formatDistanceToNow } from 'date-fns';

import Button from '@/components/General/Button';
import Flair from '@/components/Social/Flair';
import Link from '@/components/General/Link';
import Options from '@/components/ArticlePage/Comments/Options';

import LikeIcon from '@mui/icons-material/ArrowUpwardRounded';
import DislikeIcon from '@mui/icons-material/ArrowDownwardRounded';
import CommentIcon from '@mui/icons-material/CommentOutlined';

import Typography from '@mui/material/Typography';
import StockPaper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import imageGenerator from '@/utils/imageGenerator';
import { useError } from '@/utils/hooks/useSnackbar';
import { useArticle } from '@/utils/hooks/useArticle';

const Paper = withStyles((theme) => ({
  root: {
    borderRadius: 30,
    backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.background.paper,
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
  const { setError, setSuccess } = useError();

  const [vote, setVote] = React.useState(null);

  const handleVote = async (voteHandle) => {
    setError('You need to be logged in to do this action!');
    return;
  };

  const handleCommentDelete = async () => {
    try {
      setSuccess('Successfully deleted comment!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReplyDelete = async () => {
    try {
      setSuccess('Successfully deleted reply!');
    } catch (err) {
      setError(err.message);
    }
  };

  const isOwner = () => {
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
                  color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => { handleVote('up'); }}
                  disabled={true}
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
                  color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => { handleVote('down'); }}
                  disabled={true}
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
                  { commentsSocialStats[details.id].replyCount > 0 ? (
                    <Button
                      style={{ padding: 0 }}
                      variant="text"
                      color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
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
