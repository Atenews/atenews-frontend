import React from 'react';
import { useRouter } from 'next/router';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import Link from '@/components/General/Link';

import AccountIcon from '@material-ui/icons/AccountCircle';
import ClockIcon from '@material-ui/icons/AccessTime';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import ShareIcon from '@material-ui/icons/ShareOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ReactInfo from '@/components/Social/ReactInfo';

import { formatDistanceToNow } from 'date-fns';
import slugGenerator from '@/utils/slugGenerator';
import imageGenerator from '@/utils/imageGenerator';
import coauthors from '@/utils/coauthors';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import {
  Typography, Hidden, Grid, Card, CardMedia, CardContent, CardActionArea,
} from '@material-ui/core';

import useFirebaseDatabase from '@/utils/hooks/useFirebaseDatabase';

const useStyles = makeStyles((theme) => ({
  trendingStats: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white',
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
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  bannerImage: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
}));

const Article = ({ article, topImage }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

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

  return (
    <div>
      <Card style={{ marginBottom: theme.spacing(4), borderRadius: 10 }} variant="outlined">
        <Grid container alignItems="stretch">
          { topImage
            ? (
              <>
                <Grid item xs={12}>
                  <CardActionArea onClick={() => router.push(slugGenerator(article))}>
                    <LazyLoadComponent>
                      <CardMedia
                        className={classes.media}
                        image={imageGenerator(article.featuredImage?.node.sourceUrl, 500)}
                      />
                    </LazyLoadComponent>
                  </CardActionArea>
                </Grid>
                <Grid item xs={12}>
                  <CardContent style={{ padding: theme.spacing(3) }}>
                    <Link href={slugGenerator(article)}><Typography variant="h5" component="div" dangerouslySetInnerHTML={{ __html: article.title }} /></Link>
                    <Grid
                      container
                      style={{
                        color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white',
                        marginTop: theme.spacing(1),
                      }}
                      spacing={1}
                    >
                      <Grid item xs>
                        <Grid container spacing={1} wrap="nowrap">
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
                      <Grid item xs>
                        <Grid container spacing={1} wrap="nowrap">
                          <Grid item>
                            <ClockIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="caption">{ formatDistanceToNow(new Date(article.date.replace(/\s/, 'T')), { addSuffix: true }) }</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                    <Grid
                      container
                      style={{
                        color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white',
                        marginTop: theme.spacing(2),
                        width: '100%',
                      }}
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Grid item xs>
                        <ReactInfo socialStats={socialStats} />
                      </Grid>
                      <Grid item xs>
                        <Grid container spacing={1}>
                          <Grid item>
                            <CommentIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">{socialStats ? socialStats.commentCount || 0 : 0}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs>
                        <Grid container spacing={1}>
                          <Grid item>
                            <ShareIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">{socialStats ? socialStats.shareCount || 0 : 0}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs>
                        <Grid container spacing={1}>
                          <Grid item>
                            <VisibilityIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">{article.postViews || 0}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </>
            )
            : (
              <>
                <Hidden smUp>
                  <Grid item xs={12}>
                    <CardActionArea onClick={() => router.push(slugGenerator(article))}>
                      <LazyLoadComponent>
                        <CardMedia
                          className={classes.media}
                          image={imageGenerator(article.featuredImage?.node.sourceUrl, 600)}
                        />
                      </LazyLoadComponent>
                    </CardActionArea>
                  </Grid>
                </Hidden>
                <Hidden xsDown>
                  <Grid item sm={6} component={CardActionArea} className={classes.bannerImage} style={{ backgroundImage: `url(${imageGenerator(article.featuredImage?.node.sourceUrl, 600)})` }} onClick={() => router.push(slugGenerator(article))} />
                </Hidden>
                <Grid item xs={12} sm={6}>
                  <CardContent style={{ padding: theme.spacing(4) }}>
                    <Link href={slugGenerator(article)}><Typography variant="h5" component="div" dangerouslySetInnerHTML={{ __html: article.title }} /></Link>
                    <Grid
                      container
                      style={{
                        color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white',
                        marginTop: theme.spacing(1),
                      }}
                      spacing={1}
                    >
                      <Grid item xs={12}>
                        <Grid container spacing={1} wrap="nowrap">
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
                      <Grid item xs={12}>
                        <Grid container spacing={1} wrap="nowrap">
                          <Grid item>
                            <ClockIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="caption">{ formatDistanceToNow(new Date(article.date.replace(/\s/, 'T')), { addSuffix: true }) }</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                    <Grid
                      container
                      style={{
                        color: theme.palette.type === 'light' ? theme.palette.primary.main : 'white',
                        marginTop: theme.spacing(2),
                        width: '100%',
                      }}
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Grid item xs>
                        <ReactInfo socialStats={socialStats} />
                      </Grid>
                      <Grid item xs>
                        <Grid container spacing={1}>
                          <Grid item>
                            <CommentIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">{socialStats ? socialStats.commentCount : 0}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs>
                        <Grid container spacing={1}>
                          <Grid item>
                            <ShareIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">{socialStats ? socialStats.shareCount || 0 : 0}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs>
                        <Grid container spacing={1}>
                          <Grid item>
                            <VisibilityIcon />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">{article.postViews || 0}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </>
            )}
        </Grid>
      </Card>
    </div>
  );
};

export default Article;
