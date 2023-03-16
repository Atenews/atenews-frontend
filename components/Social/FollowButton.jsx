import React from 'react';

import Button from '@/components/General/Button';

import FollowIcon from '@mui/icons-material/Add';
import UnfollowIcon from '@mui/icons-material/Remove';

import { useTheme } from '@mui/material/styles';

export default function FollowButton({ category }) {
  const theme = useTheme();

  const [ready, setReady] = React.useState(false);
  const [unfollowed, _setUnfollowed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  return null;

  /*
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
  */
}
