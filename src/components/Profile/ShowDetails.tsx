// @ts-nocheck

import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import MailIcon from '@mui/icons-material/Mail';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import SocialCounts from '@/components/Profile/SocialCounts';

const useStyles = makeStyles((theme) => ({
  iconStats: {
    width: 'fit-content',
  },
  section: {
    marginTop: theme.spacing(4),
  },
}));

export default function ShowDetails({
  profile, displayName, username, bio, email,
}) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: theme.spacing(2) }}>
        <Grid item style={{ padding: 0, paddingLeft: theme.spacing(1) }}>
          <Typography variant="h4">{displayName}</Typography>
        </Grid>
        <Grid item xs={12} style={{ padding: 0, paddingLeft: theme.spacing(1) }}>
          <Typography variant="body1">{`@${username}`}</Typography>
        </Grid>
      </Grid>
      <SocialCounts profile={profile} />
      <div className={classes.section}>
        <Typography variant="body1">{bio || <i>This profile has no bio.</i>}</Typography>
      </div>
      <div className={classes.section}>
        <Grid container spacing={2}>
          <Grid item>
            <div className={classes.iconStats}>
              <Grid container spacing={1} wrap="nowrap">
                <Grid item>
                  <MailIcon color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{email || 'Processing...'}</Typography>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
