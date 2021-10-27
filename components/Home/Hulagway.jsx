import React from 'react';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {
  Typography, Grid,
} from '@mui/material';

import imageGenerator from '@/utils/imageGenerator';
import coauthors from '@/utils/coauthors';

const useStyles = makeStyles(() => ({
  section: {
    marginTop: 80,
  },
}));

export default function Hulagway({ featuredPhoto }) {
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
            HULAGWAY
          </Typography>
        </Grid>
        <Grid item xs>
          <div style={{ backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white', height: 1, width: '100%' }} />
        </Grid>
      </Grid>
      <div style={{ borderRadius: 10, overflow: 'hidden' }}>
        <LazyLoadImage src={imageGenerator(featuredPhoto.featuredImage?.node.sourceUrl, 800)} alt="Featured" width="100%" style={{ width: '100%' }} effect="blur" />
      </div>
      <Typography variant="body1" component="div" style={{ padding: theme.spacing(2), textAlign: 'center' }}>
        <Grid container justifyContent="center">
          <Grid item>
            { /* eslint-disable-next-line react/no-danger */ }
            <div dangerouslySetInnerHTML={{ __html: featuredPhoto.content }} />
          </Grid>
        </Grid>
      </Typography>

      <Typography variant="body2" style={{ textAlign: 'center' }}>
        <i>
          Photo by&nbsp;
          { coauthors(featuredPhoto.coauthors.nodes) }
        </i>

      </Typography>
    </div>
  );
}
