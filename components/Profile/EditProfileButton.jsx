import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';

import DeleteAccountButton from '@/components/Profile/DeleteAccountButton';

import Button from '@/components/General/Button';

import {
  TextField as StockTextField,
  FormControl,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';

import { useError } from '@/utils/hooks/useSnackbar';
import firebase from '@/utils/firebase';
import { useAuth } from '@/utils/hooks/useAuth';
import {
  testDisplayName, testUsername, testBio, testEmail,
} from '@/utils/regexTests';

const useStyles = makeStyles((theme) => ({
  section: {
    marginTop: theme.spacing(4),
  },
}));

const TextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 30,
      },
    },
  },
})(StockTextField);

export default function EditProfileButton({
  profile,
  displayName,
  username,
  backup,
  bio,
  email,
  setBackup,
  setDisplayName,
  setUsername,
  setBio,
  setEmail,
  password,
  setPassword,
  editMode,
  setEditMode,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const {
    authUser, profile: authProfile,
  } = useAuth();
  const { setError, setSuccess } = useError();

  const [updating, setUpdating] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  const [confirmPasswordDialog, setConfirmPasswordDialog] = React.useState(false);

  const [firebaseUser, setFirebaseUser] = React.useState(null);

  const handleDialogClose = () => {
    setConfirmPasswordDialog(false);
  };

  const handleDialogOpen = () => {
    setConfirmPasswordDialog(true);
  };

  const verifyAction = (tEmail) => fetch('/api/auth/verify', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `email=${tEmail}`,
  }).then((response) => response.json());

  const handleEditProfile = async () => {
    if (editMode) {
      setUpdating(true);
      if (!testDisplayName(displayName)) {
        setError('Display Name is limited to 50 characters only!');
        setUpdating(false);
        return;
      }
      if (!testUsername(username)) {
        setError('Username is limited to 15 alphanumeric characters only!');
        setUpdating(false);
        return;
      }
      if (username !== backup.username) {
        const existingUser = await firebase.firestore().collection('users').where('username', '==', username).get();
        if (!existingUser.empty) {
          setError('Username already taken!');
          setUpdating(false);
          return;
        }
      }
      if (!testBio(bio)) {
        setError('Bio is limited to 160 characters only!');
        setUpdating(false);
        return;
      }
      if (!testEmail(email)) {
        setError('Invalid email format detected!');
        setUpdating(false);
        return;
      }
      try {
        if (email !== backup.email) {
          await firebaseUser.updateEmail(email);
          await verifyAction(email);
        }
        await firebase.firestore().collection('users').doc(authUser.uid).update({
          displayName,
          username,
          bio: bio || '',
          email,
        });

        setBackup({
          displayName,
          username,
          bio,
          email,
        });

        setSuccess('Successfully updated profile!');
      } catch (err) {
        setDisplayName(backup.displayName);
        setUsername(backup.username);
        setBio(backup.bio);
        setEmail(backup.email);

        setError(err.message);
      }
      setUpdating(false);
    } else {
      setBackup({
        displayName,
        username,
        bio,
        email,
      });
    }

    setEditMode((prev) => !prev);
  };

  const handleConfirmPassword = async (e) => {
    e.preventDefault();
    setConfirming(true);
    try {
      const userCredential = await firebase.auth()
        .signInWithEmailAndPassword(profile.email, password);
      setFirebaseUser(userCredential.user);
      handleDialogClose();
      handleEditProfile();
    } catch (err) {
      setError('Incorrect password! Please try again.');
    }
    setConfirming(false);
    setPassword('');
  };

  return (
    <>
      <Dialog
        open={confirmPasswordDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle id="form-dialog-title">Update Profile</DialogTitle>
        <form onSubmit={handleConfirmPassword}>
          <DialogContent style={{ padding: theme.spacing(2) }}>
            <FormControl>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={password}
                size="small"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormHelperText variant="outlined">Password is required to update profile.</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions style={{ padding: theme.spacing(2) }}>
            <Button variant="contained" color="primary" type="submit" disabled={confirming}>{editMode ? 'Update Profile' : 'Edit Profile'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      {(authProfile.username === profile.username ? (
        <div className={classes.section} style={{ marginTop: theme.spacing(3) }}>
          <Grid container direction="column">
            { editMode ? (
              <Grid item>
                <DeleteAccountButton updating={updating} />
              </Grid>
            ) : null }
            <Grid item>
              <Button variant="contained" color="primary" size="large" onClick={editMode ? handleEditProfile : handleDialogOpen} disabled={updating}>{editMode ? 'Update Profile' : 'Edit Profile'}</Button>
            </Grid>
          </Grid>
        </div>
      ) : null)}
    </>
  );
}
