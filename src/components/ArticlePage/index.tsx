// @ts-nocheck

import React from 'react';

import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { format } from 'date-fns';

import {
  LazyLoadImage,
  LazyLoadComponent,
} from 'react-lazy-load-image-component';
import imageGenerator from '@/utils/imageGenerator';

import ScheduleIcon from '@mui/icons-material/Schedule';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import VisibilityIcon from '@mui/icons-material/Visibility';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Hidden from '@mui/material/Hidden';

import trpc from '@/utils/trpc';

import readingTime from 'reading-time';

import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';

import { useRouter } from 'next/router';

const Commento = dynamic(import('@/components/ArticlePage/Commento'));

const DiscussionEmbed = dynamic(import('disqus-react').then((mod) => mod.DiscussionEmbed), { ssr: false });

const Error404 = dynamic(import('@/components/404'));

const WriterInfo = dynamic(import('@/components/ArticlePage/WriterInfo'));
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

const options: HTMLReactParserOptions = {
  // eslint-disable-next-line consistent-return
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      if (domNode?.tagName === 'img') {
        return (
          <center>
            <img
              style={{ maxWidth: '100%' }}
              src={imageGenerator(domNode?.attribs.src, 800)}
              alt={domNode?.attribs.alt}
            />
          </center>
        );
      }
    }
  },
};

interface Props {
  post: Article;
  relatedPosts?: Article[];
  pageInfo?: {
    endCursor: string | null;
    hasNextPage: boolean;
  };
  categories: Category[];
}

// TODO: Fix type errors for handleViewports remove ts-nocheck after
const ArticlePage: React.FC<Props> = ({
  post, relatedPosts, pageInfo, categories,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : '';

  const articleViewCount = trpc.updateViewCount.useMutation();

  const [showSideWriterBlock, setShowSideWriterBlock] = React.useState(false);

  const sideWriterRef = React.useRef(null);

  let viewTimer: number | undefined;

  React.useEffect(() => {
    const time = readingTime(post.content ?? '').time * 0.25;
    clearTimeout(viewTimer);
    viewTimer = window.setTimeout(() => {
      articleViewCount.mutateAsync({ slug: post.slug ?? '' });
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
    <div key={post.databaseId}>
      <Hidden mdDown>
        <Typography
          variant="h3"
          component="h1"
          dangerouslySetInnerHTML={{ __html: post.title ?? '' }}
        />
      </Hidden>
      <Hidden mdUp>
        <Typography
          variant="h4"
          component="h1"
          dangerouslySetInnerHTML={{ __html: post.title ?? '' }}
        />
      </Hidden>
      <Grid
        container
        alignItems="center"
        style={{ marginTop: theme.spacing(2) }}
        spacing={1}
        wrap="nowrap"
      >
        <Grid item>
          <ScheduleIcon fontSize="small" />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {format(new Date(post.date ?? ''), 'MMMM d, yyyy (h:mm a)')}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" spacing={1} wrap="nowrap">
        <Grid item>
          <ChromeReaderModeIcon fontSize="small" />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {readingTime(post.content ?? '').text}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        style={{ marginBottom: theme.spacing(2) }}
        spacing={1}
        wrap="nowrap"
      >
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
          marginBottom: theme.spacing(2),
          marginTop: theme.spacing(2),
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : '#F0F2F5',
          borderRadius: 0,
        }}
      >
        <LazyLoadImage
          src={imageGenerator(post.featuredImage?.node.sourceUrl ?? '', 800)}
          alt={post.featuredImage?.node.caption}
          width="100%"
          effect="opacity"
        />
        <div style={{ padding: theme.spacing(2) }}>
          {/* eslint-disable-next-line react/no-danger */}
          <Typography variant="body2">
            <i
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: post.featuredImage?.node.caption?.replace('<p>', '').replace('</p>', '') ?? '',
              }}
            />
          </Typography>
        </div>
      </Paper>
      <div className={classes.sideWriter} ref={sideWriterRef}>
        <SideWriter
          authors={post.coauthors?.nodes}
          tags={post.categories?.nodes}
          show={showSideWriterBlock}
        />
      </div>

      <WriterInfo
        authors={post.coauthors?.nodes ?? []}
        onLeaveViewport={leaveWriterViewport}
        onEnterViewport={enterWriterViewport}
      />
      <article
        style={{
          marginTop: theme.spacing(2),
          lineHeight: '1.9em',
          width: '100%',
          color: theme.palette.text.primary,
        }}
      >
        {parse(post.content ?? '', options)}
      </article>

      <div style={{ height: theme.spacing(4) }} />
      {(post.categories?.nodes.filter((cat) => cat.slug === 'columns')?.length ?? 0)
      > 0 ? (
        <>
          <Divider
            style={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            }}
          />

          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Avatar
                src={post.coauthors.nodes[0].avatar?.url ?? ''}
                style={{ width: 150, height: 150 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{`About ${post.coauthors?.nodes[0].firstName} ${post.coauthors?.nodes[0].lastName} - ${post.coauthors?.nodes[0].nickname}`}</Typography>
              <Typography variant="body2">
                {post.coauthors?.nodes[0].description}
              </Typography>
            </Grid>
          </Grid>

          <Divider
            style={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            }}
          />
        </>
        ) : null}

      <Divider />
      <div style={{ height: theme.spacing(4) }} />
      <div style={{ height: theme.spacing(2) }} />
      {/*
      <DiscussionEmbed
        shortname="atenews-1"
        config={{
          url: `${origin}/${post.slug}`,
          identifier: `${post.databaseId}` ?? undefined,
          title: post.title,
          language: 'en_US',
        }}
      />
      */}

      <Commento
        pageId={post.slug}
      />

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
};

export default ArticlePage;
