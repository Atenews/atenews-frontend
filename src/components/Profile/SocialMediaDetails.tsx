import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles((theme) => ({
  iconStats: {
    width: 'fit-content',
    marginRight: theme.spacing(4),
  },
  section: {
    marginTop: theme.spacing(4),
  },
}));

export default function ConnectButtons({ profile: rawProfile }) {
  const theme = useTheme();
  const classes = useStyles();

  const [twitterFound, setTwitterFound] = React.useState(false);
  const [facebookFound, setFacebookFound] = React.useState(false);

  const [profile, setProfile] = React.useState(rawProfile);

  React.useEffect(() => {
    setProfile(rawProfile);
    if (rawProfile) {
      if ('twitterUsername' in rawProfile) {
        setTwitterFound(true);
      }
      if ('facebookUsername' in rawProfile) {
        setFacebookFound(true);
      }
    }
  }, [rawProfile]);

  return (
    <Grid container spacing={2} style={{ marginTop: theme.spacing(2) }}>
      { twitterFound ? (
        <Grid item>
          <div className={classes.iconStats}>
            <Grid container spacing={1} wrap="nowrap">
              <Grid item>
                <TwitterIcon color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
              </Grid>
              <Grid item>
                <Typography variant="body1">{`@${profile.twitterUsername}`}</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      ) : null}
      { facebookFound ? (
        <Grid item>
          <div className={classes.iconStats}>
            <Grid container spacing={1} wrap="nowrap">
              <Grid item>
                <FacebookIcon color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
              </Grid>
              <Grid item>
                <Typography variant="body1">{profile.facebookUsername}</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      ) : null}
    </Grid>
  );
}
