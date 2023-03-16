import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import AccountIcon from '@mui/icons-material/AccountCircle';
import ClockIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/CommentOutlined';
import ShareIcon from '@mui/icons-material/ShareOutlined';

import ReactInfo from '@/components/Social/ReactInfo';

import { formatDistanceToNow } from 'date-fns';
import coauthors from '@/utils/coauthors';
import slugGenerator from '@/utils/slugGenerator';
import imageGenerator from '@/utils/imageGenerator';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CardActionArea from '@mui/material/CardActionArea';

const useStyles = makeStyles((theme) => ({
  trendingItem: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
  },
  trendingStats: {
    width: '100%',
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
    padding: theme.spacing(0.5),
  },
  trendingStatsText: {
    fontSize: '0.8rem',
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
}));

const Column = ({ article }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const [socialStats, setSocialStats] = React.useState(null);

  return (
    <CardActionArea
      onClick={() => router.push(slugGenerator(article))}
      style={{ marginTop: theme.spacing(1) }}
    >
      <Paper variant="outlined" className={classes.trendingItem}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              className={classes.avatar}
              src={imageGenerator(article.coauthors.nodes[0].avatar.url, 300)}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" component="div" className={classes.twoLineText} style={{ marginBottom: theme.spacing(1) }} dangerouslySetInnerHTML={{ __html: article.title }} />
            <Grid container spacing={1}>
              <Grid item sm={12}>
                <Grid container spacing={1} wrap="nowrap" style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>
                  <Grid item>
                    <AccountIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="caption">
                      { coauthors(article.coauthors.nodes) }
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
                    <Typography variant="caption">{ formatDistanceToNow(new Date(article.date), { addSuffix: true }) }</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} component="div" className={classes.trendingStats} justifyContent="flex-start">
              <Grid item xs>
                <ReactInfo
                  IconProps={{ className: classes.trendingStatsText }}
                  TextProps={{ className: classes.trendingStatsText }}
                  GridProps={{ alignItems: 'center' }}
                  socialStats={socialStats}
                />
              </Grid>
              <Grid item xs>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <CommentIcon className={classes.trendingStatsText} />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.trendingStatsText} variant="subtitle2">{socialStats ? socialStats.commentCount : 0}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <ShareIcon className={classes.trendingStatsText} />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.trendingStatsText} variant="subtitle2">{socialStats ? socialStats.shareCount || 0 : 0}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <VisibilityIcon className={classes.trendingStatsText} />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.trendingStatsText} variant="subtitle2">{article.postViews || 0}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </CardActionArea>
  );
};

export default Column;
