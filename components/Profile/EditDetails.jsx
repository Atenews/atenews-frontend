import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';

import { Mail as MailIcon } from '@mui/icons-material';

import Flair from '@/components/Social/Flair';

import {
  Grid,
  TextField as StockTextField,
  InputAdornment,
  FormControl,
  FormHelperText,
} from '@mui/material';
import {
  testDisplayName, testUsername, testBio, testEmail,
} from '@/utils/regexTests';

const useStyles = makeStyles((theme) => ({
  iconStats: {
    width: 'fit-content',
    marginRight: theme.spacing(4),
  },
  section: {
    marginTop: theme.spacing(4),
  },
}));

const TextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 30,
      },
    },
  },
})(StockTextField);

export default function EditDetails({
  profile,
  displayName,
  setDisplayName,
  username,
  setUsername,
  bio,
  setBio,
  email,
  setEmail,
}) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: theme.spacing(2) }}>
        <Grid item style={{ padding: 0, paddingLeft: theme.spacing(1) }}>
          <FormControl style={{ marginBottom: theme.spacing(2) }}>
            <TextField
              label="Display Name"
              variant="outlined"
              value={displayName}
              error={!(testDisplayName(displayName))}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <FormHelperText variant="outlined">{`${displayName ? displayName.length || 0 : 0}/50`}</FormHelperText>
          </FormControl>
        </Grid>
        { profile.staff ? (
          <Grid item xs>
            <Flair />
          </Grid>
        ) : null}
        <Grid item xs={12} style={{ padding: 0, paddingLeft: theme.spacing(1) }}>
          <FormControl>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">@</InputAdornment>,
              }}
              error={!(testUsername(username))}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormHelperText variant="outlined">{`${username ? username.length || 0 : 0}/15`}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <div className={classes.section}>
        <FormControl fullWidth>
          <TextField
            label="Bio"
            variant="outlined"
            value={bio}
            multiline
            rows={4}
            maxRows={4}
            fullWidth
            error={!(testBio(bio))}
            onChange={(e) => setBio(e.target.value)}
          />
          <FormHelperText variant="outlined">{`${bio ? bio.length || 0 : 0}/240`}</FormHelperText>
        </FormControl>
      </div>
      <div className={classes.section}>
        <Grid container>
          <Grid item>
            <div className={classes.iconStats}>
              <Grid container spacing={1}>
                <Grid item>
                  <MailIcon color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
                </Grid>
                <Grid item>
                  <FormControl>
                    <TextField
                      label="Email"
                      variant="outlined"
                      value={email}
                      error={!(testEmail(email))}
                      size="small"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormHelperText variant="outlined">Verification email will be sent after updating.</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
