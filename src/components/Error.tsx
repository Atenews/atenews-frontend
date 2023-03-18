import React from 'react';

import Head from 'next/head';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const CustomError = ({ statusCode }) => (
  <>
    <Head>
      <meta name="robots" content="noindex" />
      {statusCode ? (
        <title>{`Error ${statusCode} - Atenews`}</title>
      ) : (
        <title>Client Error - Atenews</title>
      )}
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
        {statusCode ? (
          <Typography variant="h4">{`Error ${statusCode}`}</Typography>
        ) : (
          <Typography variant="h4">An error occured on client!</Typography>
        )}
      </Grid>
      <Grid item>
        <Typography variant="h5">The dev team is working hard to fix this!</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">Try to refresh the page in a few moments.</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">Sorry for the inconvenience 👉👈</Typography>
      </Grid>
    </Grid>
  </>
);

export default CustomError;
