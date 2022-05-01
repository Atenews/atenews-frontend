import React from 'react';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';

const useStyles = makeStyles(() => ({
  section: {
    marginTop: 80,
  },
}));

export default function LatestRelease() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.section}>
      <Grid container justifyContent="center" alignItems="center" spacing={1} style={{ marginBottom: theme.spacing(4), paddingLeft: theme.spacing(8), paddingRight: theme.spacing(8) }}>
        <Grid item xs>
          <div style={{ backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white', height: 1, width: '100%' }} />
        </Grid>
        <Grid item xs>
          <Typography
            variant="h4"
            style={{
              fontFamily: 'Open Sans', fontWeight: 300, letterSpacing: 5, textAlign: 'center',
            }}
          >
            LATEST RELEASE
          </Typography>
        </Grid>
        <Grid item xs>
          <div style={{ backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white', height: 1, width: '100%' }} />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6}>
          <CardActionArea onClick={() => window.open('https://issuu.com/atenews/docs/elections_issue_2022', '_blank')}>
            <Paper variant="outlined" style={{ borderRadius: 10, overflow: 'hidden' }}>
              <LazyLoadImage src="/issuu-demo.png" alt="Issuu" style={{ width: '100%' }} effect="blur" />
            </Paper>
          </CardActionArea>
        </Grid>
      </Grid>
    </div>
  );
}
