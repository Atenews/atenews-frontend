import React from 'react';

import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';

import DefaultErrorPage from '@/components/404';

import { useError } from '@/utils/hooks/useSnackbar';

import Button from '@/components/General/Button';

const useStyles = makeStyles(() => ({
  contentContainer: {
    width: '90%',
    margin: 'auto',
  },
}));

export default function Page({ mode, oobCode, continueUrl }) {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const { setSuccess, setError } = useError();

  const testPassword = () => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  if (!oobCode || !mode || mode !== 'resetPassword') {
    return (
      <DefaultErrorPage />
    );
  }

  const handleReset = (e) => {
    e.preventDefault();
    if (password && confirmPassword) {
      setLoading(true);
    } else {
      setError('All fields are required!');
    }
  };

  return (
    <div className={classes.container}>
      <NextSeo
        title="Reset Password - Atenews"
        openGraph={{
          title: 'Reset Password - Atenews',
          images: [
            {
              url: '/default-thumbnail.jpg',
            },
          ],
        }}
        twitter={{
          handle: '@atenews',
          cardType: 'summary_large_image',
        }}
      />
      <Card variant="outlined" style={{ marginTop: theme.spacing(8) }}>
        <CardContent>
          <form onSubmit={handleReset}>
            <Grid container spacing={2} alignItems="center" direction="column">
              <Grid item style={{ width: '100%' }}>
                <TextField
                  type="password"
                  variant="outlined"
                  label="New password"
                  fullWidth
                  required
                  error={!(testPassword()) && password !== ''}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item style={{ width: '100%' }}>
                <TextField
                  type="password"
                  variant="outlined"
                  label="Confirm new password"
                  fullWidth
                  required
                  error={password !== confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item style={{ width: '100%' }}>
                <Button type="submit" variant="contained" color="primary" size="small" fullWidth disabled={loading}>Reset Password</Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export const getServerSideProps = async ({ query }) => ({
  props: {
    mode: 'mode' in query ? query.mode : null,
    oobCode: 'oobCode' in query ? query.oobCode : null,
    continueUrl: 'continueUrl' in query ? query.continueUrl : null,
  },
});
