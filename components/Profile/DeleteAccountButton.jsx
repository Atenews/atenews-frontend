import React from 'react';

import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

import Button from '@/components/General/Button';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useError } from '@/utils/hooks/useSnackbar';
import { useAuth } from '@/utils/hooks/useAuth';

export default function DeleteAccountButton({ updating }) {
  const theme = useTheme();
  const router = useRouter();

  const {
    deleteAccount,
  } = useAuth();
  const { setError, setSuccess } = useError();

  const [confirming, setConfirming] = React.useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = React.useState(false);

  const handleDeleteClose = () => {
    setDeleteAccountDialog(false);
  };

  const handleDeleteOpen = () => {
    setDeleteAccountDialog(true);
  };

  const handleDeleteAccount = async () => {
    setConfirming(true);
    try {
      await deleteAccount();
      handleDeleteClose();
      setSuccess('Your account has been successfully deleted from our system!');
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
    setConfirming(false);
  };

  return (
    <>
      <Button
        variant="contained"
        style={{
          color: 'white',
          backgroundColor: 'red',
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        }}
        size="small"
        onClick={handleDeleteOpen}
        disabled={updating}
      >
        Delete Account
      </Button>

      <Dialog
        open={deleteAccountDialog}
        onClose={handleDeleteClose}
      >
        <DialogTitle id="form-dialog-title">This will delete your account.</DialogTitle>
        <Divider />
        <DialogContent style={{ padding: theme.spacing(2) }}>
          <Typography variant="body1">As much as we want you to stay, you&apos;re about to start the process of deleting your Atenews account.</Typography>
        </DialogContent>
        <DialogContent style={{ padding: theme.spacing(2) }}>
          <Typography variant="h6">What else you should know</Typography>
        </DialogContent>
        <DialogContent style={{ padding: theme.spacing(2) }}>
          <Typography variant="body1">All your comments, replies, reacts, upvotes, downvotes, and profile will be PERMANENTLY deleted from our system.</Typography>
          <Typography variant="body1">If you want to change your email address or @username, you don&apos;t need to deactivate your account. Updating your profile will suffice.</Typography>
        </DialogContent>
        <DialogContent style={{ padding: theme.spacing(2) }}>
          <Typography variant="body1">If you are sure you want to delete your account, press the confirm button below.</Typography>
        </DialogContent>
        <DialogActions style={{ padding: theme.spacing(2) }}>
          <Button
            variant="contained"
            style={{
              color: 'white',
              backgroundColor: 'red',
            }}
            onClick={handleDeleteAccount}
            disabled={confirming}
          >
            Confirm Deletion
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
