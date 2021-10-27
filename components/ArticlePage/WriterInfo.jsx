import React from 'react';

import handleViewport from 'react-in-viewport';

import {
  Grid,
} from '@mui/material';

import IndividualWriter from '@/components/ArticlePage/IndividualWriter';

export default handleViewport((props) => {
  const {
    forwardedRef, authors,
  } = props;

  return (
    <div ref={forwardedRef}>
      <Grid container spacing={4} direction="row">
        {
          authors.map((author, i) => (
            <IndividualWriter author={author} key={`author${i}`} />
          ))
        }
      </Grid>
    </div>
  );
});
