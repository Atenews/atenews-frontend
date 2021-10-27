import React from 'react';

import Button from '@/components/General/Button';

import {
  Add as FollowIcon,
  Remove as UnfollowIcon,
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';

import { useAuth } from '@/utils/hooks/useAuth';

import firebase from '@/utils/firebase';

export default function FollowButton({ category }) {
  const theme = useTheme();

  const { profile, authUser } = useAuth();

  const [ready, setReady] = React.useState(false);
  const [unfollowed, _setUnfollowed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      firebase.database().ref(`unfollows/${profile.id}`).once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            _setUnfollowed(data[category]);
          }
          setReady(true);
        });
    }
  }, [profile]);

  const toggleUnfollowed = () => {
    firebase.database().ref(`unfollows/${profile.id}`).update({
      [category]: !unfollowed,
    });
    _setUnfollowed((prev) => !prev);
  };

  if (!profile) {
    return null;
  }

  if (!authUser.emailVerified) {
    return null;
  }

  if (!ready) {
    return null;
  }

  if (!unfollowed) {
    return (
      <Button
        variant="outlined"
        style={{ backgroundColor: hovered ? 'red' : theme.palette.primary.main, color: 'white' }}
        size="small"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => toggleUnfollowed()}
      >
        { hovered ? (
          <>
            <UnfollowIcon style={{ marginRight: theme.spacing(1) }} />
            Unfollow
          </>
        ) : (
          <>
            Following
          </>
        ) }
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      elevation={0}
      color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
      size="small"
      onClick={() => toggleUnfollowed()}
    >
      <FollowIcon style={{ marginRight: theme.spacing(1) }} />
      Follow
    </Button>
  );
}
