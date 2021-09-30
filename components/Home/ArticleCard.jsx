import React from 'react';
import { useRouter } from 'next/router';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import AccountIcon from '@material-ui/icons/AccountCircle';
import ClockIcon from '@material-ui/icons/AccessTime';
import VisibilityIcon from '@material-ui/icons/Visibility';

import CommentIcon from '@material-ui/icons/CommentOutlined';
import ShareIcon from '@material-ui/icons/ShareOutlined';
import ReactInfo from '@/components/Social/ReactInfo';

import { useSpring, animated } from 'react-spring';

import { formatDistanceToNow } from 'date-fns';
import slugGenerator from '@/utils/slugGenerator';

import {
  Typography, Grid, Card, CardContent, CardActionArea,
} from '@material-ui/core';

import imageGenerator from '@/utils/imageGenerator';
import coauthors from '@/utils/coauthors';
import useFirebaseDatabase from '@/utils/hooks/useFirebaseDatabase';

const useStyles = makeStyles(() => ({
  bannerDetailsContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundImage: 'linear-gradient(180deg, transparent, black)',
  },
  twoLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
}));

const ArticleCard = ({ article }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const [containerProps, setContainerProps] = useSpring(() => ({ backgroundColor: 'rgba(0, 0, 0, 0.5)' }));
  const [textProps, setTextProps] = useSpring(() => ({ opacity: 1 }));

  const { getDocument } = useFirebaseDatabase();

  const [socialStats, setSocialStats] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = getDocument(`articles/${article.slug}`, (doc) => {
      setSocialStats(doc);
    });

    return () => {
      unsubscribe.off();
    };
  }, [article]);

  const onHover = () => {
    setContainerProps({ backgroundColor: 'rgba(0, 0, 0, 0)' });
    setTextProps({ opacity: 0 });
  };

  const onLeave = () => {
    setContainerProps({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });
    setTextProps({ opacity: 1 });
  };

  return (
    <Grid item sm={6} key={article.databaseId}>
      <CardActionArea
        onClick={() => router.push(slugGenerator(article))}
        style={{ borderRadius: 10 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <Card
          style={{
            borderRadius: 10,
            border: 0,
            height: '100%',
            background: `url(${imageGenerator(article.featuredImage?.node.sourceUrl, 600)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          variant="outlined"
        >
          <animated.div className={classes.bannerDetailsContainer} style={containerProps}>
            <CardContent style={{ padding: theme.spacing(3) }}>
              <Grid container alignItems="flex-end">
                <Grid item xs={12}>
                  <animated.div style={textProps}>
                    <Typography variant="h5" component="div" className={classes.twoLineText} style={{ color: 'white' }} dangerouslySetInnerHTML={{ __html: article.title }} />
                  </animated.div>
                </Grid>
                <Grid item xs={12} style={{ marginTop: theme.spacing(1) }}>
                  <animated.div style={textProps}>
                    <Grid container style={{ color: 'white' }} spacing={1}>
                      <Grid item xs={12}>
                        <Grid container spacing={1} wrap="nowrap">
                          <Grid item>
                            <AccountIcon style={{ color: 'white' }} />
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" style={{ color: 'white' }}>
                              { coauthors(article.coauthors.nodes) }
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={1} wrap="nowrap">
                          <Grid item>
                            <ClockIcon style={{ color: 'white' }} />
                          </Grid>
                          <Grid item>
                            <Typography style={{ color: 'white' }} variant="caption">{ formatDistanceToNow(new Date(article.date), { addSuffix: true }) }</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </animated.div>
                </Grid>
                <Grid item xs={12} style={{ marginTop: theme.spacing(2) }}>
                  <Grid container style={{ color: theme.palette.primary.main, width: '100%' }} spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid item xs>
                      <ReactInfo
                        TextProps={{ style: { color: 'white' } }}
                        IconProps={{ style: { color: 'white' } }}
                        socialStats={socialStats}
                      />
                    </Grid>
                    <Grid item xs>
                      <Grid container spacing={1} wrap="nowrap">
                        <Grid item>
                          <CommentIcon style={{ color: 'white' }} />
                        </Grid>
                        <Grid item>
                          <Typography style={{ color: 'white' }} variant="subtitle2">{socialStats ? socialStats.commentCount : 0}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs>
                      <Grid container spacing={1} wrap="nowrap">
                        <Grid item>
                          <ShareIcon style={{ color: 'white' }} />
                        </Grid>
                        <Grid item>
                          <Typography style={{ color: 'white' }} variant="subtitle2">{socialStats ? socialStats.shareCount || 0 : 0}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs>
                      <Grid container spacing={1} wrap="nowrap">
                        <Grid item>
                          <VisibilityIcon style={{ color: 'white' }} />
                        </Grid>
                        <Grid item>
                          <Typography style={{ color: 'white' }} variant="subtitle2">{socialStats ? socialStats.viewsCount || 0 : 0}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </animated.div>
        </Card>
      </CardActionArea>
    </Grid>
  );
};

export default ArticleCard;
