import React from 'react';

import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import {
  Schedule as ScheduleIcon,
  ChromeReaderMode as ChromeReaderModeIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

import { format } from 'date-fns';

import { CSSTransition } from 'react-transition-group';

import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import imageGenerator from '@/utils/imageGenerator';
import { useArticle } from '@/utils/hooks/useArticle';

import {
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  Hidden,
  Avatar,
} from '@mui/material';

import readingTime from 'reading-time';

import fetch from '@/utils/postFetch';

import parse from 'html-react-parser';

const CommentField = dynamic(import('@/components/ArticlePage/Comments/CommentField'));

const ShareButton = dynamic(import('@/components/ArticlePage/ShareButton'));
const Error404 = dynamic(import('@/components/404'));

const WriterInfo = dynamic(import('@/components/ArticlePage/WriterInfo'));
const ReactArticle = dynamic(import('@/components/ArticlePage/Reacts/ReactArticle'));
const ReactInfoArticle = dynamic(import('@/components/ArticlePage/Reacts/ReactInfoArticle'));
const Comment = dynamic(import('@/components/ArticlePage/Comments/Comment'));
const ReadMore = dynamic(import('@/components/ArticlePage/ReadMore'));
const SideWriter = dynamic(import('@/components/ArticlePage/SideWriter'));

const useStyles = makeStyles(() => ({
  account: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    right: 0,
    marginRight: 20,
    height: 65,
  },
  readMore: {
    position: 'fixed',
    width: 'calc(15vw - 10px)',
    top: 'calc(65px + 8vh)',
    right: 10,
  },
  sideWriter: {
    position: 'fixed',
    width: 'calc(15vw - 10px)',
    top: 'calc(35px + 8vh)',
    right: 40,
  },
}));

export default function Page({
  post, relatedPosts, pageInfo, categories,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    article: { article },
    writerImages: { writerImages },
    comments: { comments, commentsSocialStats },
  } = useArticle();

  const [showSideWriterBlock, setShowSideWriterBlock] = React.useState(false);

  let viewTimer = null;

  React.useEffect(() => {
    const time = readingTime(post.content).time * 0.25;
    clearTimeout(viewTimer);
    viewTimer = setTimeout(() => {
      fetch('/api/update/viewCount', { slug: post.slug });
      fetch('/api/graphql/updateArticleViewCount', { slug: post.slug });
    }, time);
  }, [post]);

  if (post === null) {
    return <Error404 />;
  }

  const enterWriterViewport = () => {
    setShowSideWriterBlock(false);
  };

  const leaveWriterViewport = () => {
    setShowSideWriterBlock(true);
  };

  return (
    <div className={classes.container} key={post.databaseId}>
      <Hidden mdDown>
        <Typography variant="h3" component="h1" dangerouslySetInnerHTML={{ __html: post.title }} />
      </Hidden>
      <Hidden mdUp>
        <Typography variant="h4" component="h1" dangerouslySetInnerHTML={{ __html: post.title }} />
      </Hidden>
      <Grid container alignItems="center" style={{ marginTop: theme.spacing(2) }} spacing={1} wrap="nowrap">
        <Grid item>
          <ScheduleIcon fontSize="small" />
        </Grid>
        <Grid item>
          <Typography variant="body2">{ format(new Date(post.date), 'MMMM d, yyyy (h:mm a)') }</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" spacing={1} wrap="nowrap">
        <Grid item>
          <ChromeReaderModeIcon fontSize="small" />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {readingTime(post.content).text}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" style={{ marginBottom: theme.spacing(2) }} spacing={1} wrap="nowrap">
        <Grid item>
          <VisibilityIcon fontSize="small" />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {`${post.postViews || 0} views`}
          </Typography>
        </Grid>
      </Grid>
      <Paper
        elevation={0}
        style={{
          marginBottom: theme.spacing(2), marginTop: theme.spacing(2), backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F0F2F5', borderRadius: 0,
        }}
      >
        <LazyLoadImage src={imageGenerator(post.featuredImage?.node.sourceUrl, 800)} alt={post.featuredImage?.node.caption} width="100%" effect="opacity" />
        <div style={{ padding: theme.spacing(2) }}>
          {/* eslint-disable-next-line react/no-danger */}
          <Typography variant="body2"><i dangerouslySetInnerHTML={{ __html: post.featuredImage?.node.caption }} /></Typography>
        </div>
      </Paper>
      <CSSTransition
        in={showSideWriterBlock}
        timeout={300}
        classNames="side"
        unmountOnExit
      >
        <div className={classes.sideWriter}>
          <SideWriter
            authors={post.coauthors.nodes}
            tags={post.categories.nodes}
          />
        </div>
      </CSSTransition>
      <WriterInfo
        authors={post.coauthors.nodes}
        onLeaveViewport={leaveWriterViewport}
        onEnterViewport={enterWriterViewport}
      />
      <Typography
        variant="body1"
        component="div"
        style={{
          marginTop: theme.spacing(2),
          lineHeight: '1.9em',
          width: '100%',
          color: theme.palette.text.primary,
        }}
      >
        {parse(post.content, {
          // eslint-disable-next-line consistent-return
          replace: (domNode) => {
            if (domNode?.tagName === 'img') {
              return (
                <center>
                  <img style={{ maxWidth: '100%' }} src={imageGenerator(domNode?.attribs.src, 800)} alt={domNode?.attribs.alt} />
                </center>
              );
            }
          },
        })}
      </Typography>

      <div style={{ height: theme.spacing(4) }} />
      {post.categories.nodes.filter((cat) => cat.slug === 'columns').length > 0 ? (
        <>
          <Divider style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} />

          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item>
              <Avatar
                src={writerImages[post.coauthors.nodes[0].databaseId]}
                style={{ width: 150, height: 150 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{`About ${post.coauthors.nodes[0].firstName} ${post.coauthors.nodes[0].lastName} - ${post.coauthors.nodes[0].nickname}`}</Typography>
              <Typography variant="body2">{post.coauthors.nodes[0].description}</Typography>
            </Grid>
          </Grid>

          <Divider style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} />
        </>
      ) : null}

      <div style={{ height: theme.spacing(4) }} />

      <ReactInfoArticle />

      <div style={{ height: theme.spacing(2) }} />
      <Divider />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ReactArticle slug={post.slug} />
        </Grid>
        <Grid item xs={6}>
          <ShareButton article={article} />
        </Grid>
      </Grid>

      <Divider />
      <div style={{ height: theme.spacing(4) }} />

      <CommentField slug={post.slug} />
      <LazyLoadComponent>
        { comments.length === 0 ? (
          <Grid
            container
            direction="column"
            spacing={0}
            alignItems="center"
            justifyContent="center"
            style={{ marginTop: theme.spacing(4) }}
          >
            <Grid item>
              <img src="/reacts/sad.svg" alt="sad" width={40} />
            </Grid>
            <Grid item>
              <Typography variant="body1">No comments yet. Start a discussion here!</Typography>
            </Grid>
          </Grid>
        ) : (
          <List component="div">
            {comments.map((comment) => (commentsSocialStats[comment.id] ? (
              <Comment
                details={comment}
                key={comment.id}
                slug={post.slug}
              />
            ) : null)) }
          </List>
        ) }
      </LazyLoadComponent>

      <div style={{ height: theme.spacing(2) }} />

      <Divider />

      <div style={{ height: theme.spacing(8) }} />

      <LazyLoadComponent>
        <ReadMore
          relatedPosts={relatedPosts}
          pageInfo={pageInfo}
          categories={categories}
          postId={post.databaseId}
          onLeaveViewport={leaveWriterViewport}
          onEnterViewport={enterWriterViewport}
        />
      </LazyLoadComponent>

    </div>
  );
}
