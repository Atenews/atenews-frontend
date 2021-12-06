import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import AvatarGroup from '@mui/material/AvatarGroup';

import { useArticle } from '@/utils/hooks/useArticle';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  reacts: {
    width: 40,
    height: 57,
    overflow: 'visible',
  },
  container: {
    width: 'fit-content',
    '&:hover': {
      cursor: 'pointer',
    },
    marginLeft: theme.spacing(1),
    zIndex: 1,
  },
  infoReacts: {
    width: 30,
    height: 43,
    backgroundColor: 'transparent',
    overflow: 'visible',
    border: 0,
  },
}));

const ReactInfo = ({
  TextProps, GridProps, disableHover,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { article: { article } } = useArticle();

  const handlePopoverOpen = (event) => {
    if (!disableHover) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    if (!disableHover) {
      setAnchorEl(null);
    }
  };

  return (
    <>
      <div
        className={classes.container}
        onMouseEnter={article?.totalReactCount ? handlePopoverOpen : null}
        onMouseLeave={handlePopoverClose}
        onClick={article?.totalReactCount ? handlePopoverOpen : null}
      >
        <Grid container spacing={1} {...GridProps} alignItems="center" wrap="nowrap">
          { article?.totalReactCount ? (
            <Grid item>
              <AvatarGroup style={{ marginRight: theme.spacing(1) }} spacing={5}>
                { article?.reactCount?.happy ? (
                  <Avatar className={classes.infoReacts} src="/reacts/happy.svg" />
                ) : null }
                { article?.reactCount?.angry ? (
                  <Avatar className={classes.infoReacts} src="/reacts/angry.svg" />
                ) : null }
                { article?.reactCount?.sad ? (
                  <Avatar className={classes.infoReacts} src="/reacts/sad.svg" />
                ) : null }
                { article?.reactCount?.disgusted ? (
                  <Avatar className={classes.infoReacts} src="/reacts/disgust.svg" />
                ) : null }
                { article?.reactCount?.worried ? (
                  <Avatar className={classes.infoReacts} src="/reacts/worried.svg" />
                ) : null }
              </AvatarGroup>
            </Grid>
          ) : null }
          <Grid item xs>
            { article?.totalReactCount ? (
              <Typography variant="body2" {...TextProps}>
                <b>{article?.totalReactCount}</b>
                {' '}
                people reacted to this article
              </Typography>
            ) : (
              <Typography variant="body2" {...TextProps}>
                <b>Nobody</b>
                {' '}
                reacted to this article yet.
              </Typography>
            ) }
          </Grid>
        </Grid>
      </div>

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="top-start"
        disablePortal={false}
        modifiers={{
          flip: {
            enabled: false,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'scrollParent',
          },
        }}
      >
        <Grow in={Boolean(anchorEl)}>
          <Card elevation={0} variant="outlined">
            <CardContent>
              { article?.reactCount?.happy ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar className={classes.reacts} src="/reacts/happy.svg" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{article?.reactCount?.happy}</Typography>
                  </Grid>
                </Grid>
              ) : null }
              { article?.reactCount?.angry ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar className={classes.reacts} src="/reacts/angry.svg" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{article?.reactCount?.angry}</Typography>
                  </Grid>
                </Grid>
              ) : null }
              { article?.reactCount?.sad ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar className={classes.reacts} src="/reacts/sad.svg" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{article?.reactCount?.sad}</Typography>
                  </Grid>
                </Grid>
              ) : null }
              { article?.reactCount?.disgusted ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar className={classes.reacts} src="/reacts/disgust.svg" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{article?.reactCount?.disgusted}</Typography>
                  </Grid>
                </Grid>
              ) : null }
              { article?.reactCount?.worried ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar className={classes.reacts} src="/reacts/worried.svg" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{article?.reactCount?.worried}</Typography>
                  </Grid>
                </Grid>
              ) : null }
            </CardContent>
          </Card>
        </Grow>
      </Popper>
    </>
  );
};

export default ReactInfo;
