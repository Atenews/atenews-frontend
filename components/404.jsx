import React from 'react';

import Head from 'next/head';

import { Grid, Typography } from '@mui/material';

export default function Custom404() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>Error 404 - Atenews</title>
      </Head>
      <Grid
        container
        direction="column"
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}
      >
        <Grid item>
          <img src="/reacts/sad.svg" alt="sad" width={100} />
        </Grid>
        <Grid item>
          <Typography variant="h4">Error 404</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">Page not found!</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">Sorry for the inconvenience 👉👈</Typography>
        </Grid>
      </Grid>
    </>
  );
}
