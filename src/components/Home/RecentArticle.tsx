import React from 'react';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Tag from '@/components/General/Tag';

import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/CommentOutlined';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import imageGenerator from '@/utils/imageGenerator';

const useStyles = makeStyles((theme) => ({
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  bannerDetailsContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(180deg, transparent, black)',
  },
  bannerDetails: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    color: 'white',
    padding: theme.spacing(4),
  },
  trendingHead: {
    background: '#195EA9',
    color: '#ffffff',
    padding: 20,
    minHeight: 65,
    textAlign: 'center',
    width: '100%',
  },
  trendingItem: {
    position: 'relative',
    width: '100%',
    borderRadius: 0,
    borderBottom: 0,
    borderRight: 0,
    borderLeft: 0,
  },
  trendingStats: {
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
  },
  trendingStatsText: {
    fontSize: '0.8rem',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    top: 'calc(70px + 25px)',
    right: 0,
    borderTop: '20px solid transparent',
    borderBottom: '20px solid transparent',
    borderRight: `20px solid ${theme.palette.background.default}`,
    zIndex: 1,
  },
  twoLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    fontSize: '0.9rem',
  },
  threeLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
}));

function RecentArticle({ article }) {
  const classes = useStyles();
  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [socialStats, setSocialStats] = React.useState(null);

  return (
    <Paper
      variant="outlined"
      className={classes.trendingItem}
      style={xsDown ? {
        background: `url(${imageGenerator(article.featuredImage?.node.sourceUrl, 600)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        border: 0,
      } : {
        padding: theme.spacing(2),
      }}
    >
      <div style={xsDown ? {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: theme.spacing(2),
        width: '100%',
      } : { width: '100%' }}
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid
            item
          >
            <Tag type={article.categories.nodes[0]} />
          </Grid>
          <Grid
            item
          >
            <Typography
              variant="body1"
              component="div"
              className={classes.twoLineText}
              dangerouslySetInnerHTML={{ __html: article.title }}
            />
          </Grid>
          <Grid
            item
            style={{ width: '100%' }}
          >
            <Grid
              container
              className={classes.trendingStats}
              justifyContent="space-between"
              alignItems="baseline"
              style={xsDown ? { width: '100%', color: 'white' } : { width: '100%' }}
            >
              <Grid
                item
                xs
              >
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                >
                  <Grid item>
                    <VisibilityIcon className={classes.trendingStatsText} />
                  </Grid>
                  <Grid item>
                    <Typography
                      className={classes.trendingStatsText}
                      variant="subtitle2"
                    >
                      {article.postViews || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}

export default RecentArticle;
