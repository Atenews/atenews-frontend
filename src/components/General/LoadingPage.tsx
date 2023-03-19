import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/styles';
import React from 'react';

const LoadingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item>
        <img src={theme.palette.mode === 'light' ? '/logo-blue.png' : '/logo.png'} alt="Atenews Logo" width="100" />
      </Grid>
    </Grid>
  );
};

export default LoadingPage;
