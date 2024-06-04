import React from 'react';

import handleViewport, { type InjectedViewportProps } from 'react-in-viewport';

import Grid from '@mui/material/Grid';

import IndividualWriter from '@/components/ArticlePage/IndividualWriter';

interface Props extends InjectedViewportProps<HTMLDivElement> {
  authors: Author[];
}

const WriterInfo: React.FC<Props> = (props) => {
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
};

export default handleViewport(WriterInfo);
