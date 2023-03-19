import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Link from '@/components/General/Link';
import NextLink from 'next/link';

import AccountIcon from '@mui/icons-material/AccountCircle';
import ClockIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/CommentOutlined';

import { formatDistanceToNow } from 'date-fns';
import slugGenerator from '@/utils/slugGenerator';
import imageGenerator from '@/utils/imageGenerator';
import coauthors from '@/utils/coauthors';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

const useStyles = makeStyles((theme) => ({
  trendingStats: {
    position: 'absolute',
    bottom: 0,
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

interface Props {
  article: Article;
  topImage?: boolean;
}

const Article: React.FC<Props> = ({ article, topImage }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [socialStats, setSocialStats] = React.useState(null);

  return (
    <div>
      <Card style={{ marginBottom: theme.spacing(4), borderRadius: 10 }} variant="outlined">
        <Grid container alignItems="stretch">
          { topImage
            ? (
              <>
                <Grid item xs={12}>
                  <CardActionArea LinkComponent={NextLink} href={slugGenerator(article)}>
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
                        color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
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
                        color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
                        marginTop: theme.spacing(2),
                        width: '100%',
                      }}
                      spacing={2}
                      justifyContent="space-between"
                    >
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
                    <CardActionArea LinkComponent={NextLink} href={slugGenerator(article)}>
                      <LazyLoadComponent>
                        <CardMedia
                          className={classes.media}
                          image={imageGenerator(article.featuredImage?.node.sourceUrl, 600)}
                        />
                      </LazyLoadComponent>
                    </CardActionArea>
                  </Grid>
                </Hidden>
                <Hidden smDown>
                  <Grid
                    item
                    sm={6}
                  >
                    <CardActionArea
                      LinkComponent={NextLink}
                      className={classes.bannerImage}
                      style={{
                        backgroundImage: `url(${imageGenerator(article.featuredImage?.node.sourceUrl, 600)})`,
                        width: '100%',
                        height: '100%',
                      }}
                      href={slugGenerator(article)}
                    />
                  </Grid>
                </Hidden>
                <Grid item xs={12} sm={6}>
                  <CardContent style={{ padding: theme.spacing(4) }}>
                    <Link href={slugGenerator(article)}><Typography variant="h5" component="div" dangerouslySetInnerHTML={{ __html: article.title }} /></Link>
                    <Grid
                      container
                      style={{
                        color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
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
                        color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
                        marginTop: theme.spacing(2),
                        width: '100%',
                      }}
                      spacing={2}
                      justifyContent="space-between"
                    >
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
