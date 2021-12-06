import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import MailIcon from '@mui/icons-material/Mail';

import Flair from '@/components/Social/Flair';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { useAuth } from '@/utils/hooks/useAuth';

import SocialCounts from '@/components/Profile/SocialCounts';
import VerifyEmailButton from '@/components/Profile/VerifyEmailButton';

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

  const {
    authUser,
  } = useAuth();

  return (
    <>
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: theme.spacing(2) }}>
        <Grid item style={{ padding: 0, paddingLeft: theme.spacing(1) }}>
          <Typography variant="h4">{displayName}</Typography>
        </Grid>
        { profile.staff ? (
          <Grid item xs>
            <Flair />
          </Grid>
        ) : null}
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
          {authUser && profile.id === authUser.uid && email ? (
            <Grid item>
              <VerifyEmailButton />
            </Grid>
          ) : null}
        </Grid>
      </div>
    </>
  );
}
