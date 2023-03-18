import React from 'react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(6),
    display: 'flex',
  },
}));

export default function Header() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="body1">End the silence of the gagged!</Typography>
          <Typography variant="body1">
            ©
            {' '}
            {(new Date()).getFullYear()}
            {' '}
            <b style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>Atenews</b>
          </Typography>
          <Grid item container direction="row" spacing={4} justifyContent="center" style={{ marginTop: theme.spacing(1) }}>
            <Grid item>
              <IconButton
                LinkComponent={Link}
                href="https://www.facebook.com/atenews"
                target="_blank"
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                size="large"
              >
                <FacebookIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                LinkComponent={Link}
                href="https://twitter.com/atenews"
                target="_blank"
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                size="large"
              >
                <TwitterIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                LinkComponent={Link}
                href="https://instagram.com/atenews"
                target="_blank"
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                size="large"
              >
                <InstagramIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Typography variant="caption">
            <Link href="/terms-and-conditions" legacyBehavior>
              <a style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>Terms and Conditions</a>
            </Link>
          </Typography>
          {'    '}
          <Typography variant="caption">
            <Link href="/privacy-policy" legacyBehavior>
              <a style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>Privacy Policy</a>
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
