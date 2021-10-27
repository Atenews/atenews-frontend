import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Button from '@/components/General/Button';

import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';

import {
  Paper, Grid, TextField, Divider,
} from '@mui/material';

import { useError } from '@/utils/hooks/useSnackbar';
import { useAuth } from '@/utils/hooks/useAuth';
import firebase from '@/utils/firebase';

import fetch from '@/utils/postFetch';

const useStyles = makeStyles((theme) => ({
  viewContainer: {
    position: 'relative',
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
  },
  arrowUp: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: `10px solid ${theme.palette.divider}`,
  },
}));

const AuthForm = ({ close, mobile }) => {
  const classes = useStyles();
  const {
    loginWithEmail,
    loginWithTwitter,
    registerEmail,
    loginWithFacebook,
    formMode,
    setFormMode,
  } = useAuth();
  const theme = useTheme();
  const { setError, setSuccess } = useError();

  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const testUsername = () => /^[a-zA-Z0-9_]{1,15}$/.test(username);
  const testEmail = () => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  const testPassword = () => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (username && email && password && password === confirmPassword) {
      if (!testUsername()) {
        setError('Username is limited to 15 alphanumeric characters only!');
        return;
      }

      const existingUser = await firebase.firestore().collection('users').where('username', '==', username).get();

      if (!existingUser.empty) {
        setError('Username already taken!');
        return;
      }

      if (!testEmail()) {
        setError('Invalid email format detected!');
        return;
      }
      if (!testPassword()) {
        setError('Password requires a minimum eight characters, at least one letter and one number.');
        return;
      }
      setLoading(true);
      registerEmail(email, password, username, () => {
        close();
      }, () => {
        setLoading(false);
      });
    } else {
      setError('All fields are required!');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      loginWithEmail(email, password, () => {
        close();
      }, () => {
        setLoading(false);
      });
    } else {
      setError('All fields are required!');
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      fetch('/api/auth/reset', { email }).then(() => {
        setSuccess('Email sent! Please check your email for further instructions.');
        setLoading(false);
        close();
      }).catch((err) => {
        setError(err.message);
        setLoading(false);
        close();
      });
    } else {
      setError('All fields are required!');
    }
  };

  if (formMode === 'login') {
    return (
      <Paper variant="outlined" className={classes.viewContainer}>
        <form onSubmit={handleLogin}>
          { mobile ? null : <div className={classes.arrowUp} /> }
          <Grid container spacing={2} alignItems="center" direction="column">
            <Grid item style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                label="Email"
                fullWidth
                required
                error={!(testEmail()) && email !== ''}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <TextField
                type="password"
                variant="outlined"
                label="Password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Button type="submit" variant="contained" color="primary" size="small" fullWidth disabled={loading}>Login</Button>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Button
                onClick={() => { loginWithTwitter(); close(); }}
                variant="contained"
                size="small"
                fullWidth
                disabled={loading}
                style={!loading ? ({
                  backgroundColor: '#00acee',
                  color: 'white',
                }) : {}}
              >
                <TwitterIcon style={{ marginRight: theme.spacing(1) }} />
                Login with Twitter
              </Button>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Button
                onClick={() => { loginWithFacebook(); close(); }}
                variant="contained"
                size="small"
                fullWidth
                disabled={loading}
                style={!loading ? ({
                  backgroundColor: '#3b5998',
                  color: 'white',
                }) : {}}
              >
                <FacebookIcon style={{ marginRight: theme.spacing(1) }} />
                Login with FB
              </Button>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Divider style={{ marginBottom: theme.spacing(2) }} />
              <Button onClick={() => { setFormMode('register'); }} variant="contained" color="primary" size="small" fullWidth disabled={loading}>Register</Button>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Button onClick={() => { setFormMode('forgotPassword'); }} variant="contained" color="primary" size="small" fullWidth disabled={loading}>Forgot Password</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }
  if (formMode === 'register') {
    return (
      <Paper variant="outlined" className={classes.viewContainer}>
        <form onSubmit={handleRegister}>
          { mobile ? null : <div className={classes.arrowUp} /> }
          <Grid container spacing={2} alignItems="center" direction="column">
            <Grid item style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                label="Email"
                fullWidth
                required
                error={!(testEmail()) && email !== ''}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                label="Username"
                fullWidth
                required
                error={!(testUsername()) && username !== ''}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <TextField
                type="password"
                variant="outlined"
                label="Password"
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
                error={password !== confirmPassword}
                type="password"
                variant="outlined"
                label="Confirm Password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Button type="submit" variant="contained" color="primary" size="small" fullWidth disabled={loading}>Register</Button>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Divider style={{ marginBottom: theme.spacing(2) }} />
              <Button onClick={() => { setFormMode('login'); }} variant="contained" color="primary" size="small" fullWidth disabled={loading}>Login</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }

  if (formMode === 'forgotPassword') {
    return (
      <Paper variant="outlined" className={classes.viewContainer}>
        <form onSubmit={handleReset}>
          { mobile ? null : <div className={classes.arrowUp} /> }
          <Grid container spacing={2} alignItems="center" direction="column">
            <Grid item style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                label="Email"
                fullWidth
                required
                error={!(testEmail()) && email !== ''}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Button type="submit" variant="contained" color="primary" size="small" fullWidth disabled={loading}>Reset Password</Button>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Divider style={{ marginBottom: theme.spacing(2) }} />
              <Button onClick={() => { setFormMode('login'); }} variant="contained" color="primary" size="small" fullWidth disabled={loading}>Login</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }

  return null;
};

export default AuthForm;
