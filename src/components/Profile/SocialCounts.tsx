// @ts-nocheck

import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import LikeIcon from '@mui/icons-material/ArrowUpwardRounded';
import DislikeIcon from '@mui/icons-material/ArrowDownwardRounded';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const useStyles = makeStyles((theme) => ({
  iconStats: {
    width: 'fit-content',
    marginRight: theme.spacing(4),
  },
  section: {
    marginTop: theme.spacing(4),
  },
}));

export default function SocialCounts({
  profile,
}) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} xl={4}>
            <Grid container spacing={1}>
              <Grid item>
                <Typography variant="subtitle2" color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} style={{ fontWeight: 'bold', marginBottom: theme.spacing(1) }}>Social Stats</Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} style={{ fontStyle: 'italic' }}>based on article comments and replies</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} xl={4}>
            <div className={classes.iconStats}>
              <Grid container alignItems="center" spacing={1} wrap="nowrap">
                <Grid item>
                  <LikeIcon style={{ fontSize: 50 }} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
                </Grid>
                <Grid item>
                  <Grid container direction="column" justifyContent="center">
                    <Grid item>
                      <Typography variant="h5" color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>{profile.upvotesReceived || 0}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">Upvotes</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">Received</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={6} xl={4}>
            <div className={classes.iconStats}>
              <Grid container alignItems="center" spacing={1} wrap="nowrap">
                <Grid item>
                  <DislikeIcon style={{ fontSize: 50 }} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
                </Grid>
                <Grid item>
                  <Grid container direction="column" justifyContent="center">
                    <Grid item>
                      <Typography variant="h5" color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>{profile.downvotesReceived || 0}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">Downvotes</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">Received</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
