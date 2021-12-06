import React from 'react';

import { useTheme } from '@mui/material/styles';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TrashIcon from '@mui/icons-material/Delete';

import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const Options = ({ onDelete }) => {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef();

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    if (open) {
      handleClick();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <IconButton
          style={{ marginLeft: theme.spacing(1) }}
          onClick={handleClick}
          ref={buttonRef}
          size="large"
        >
          <MoreHorizIcon />
        </IconButton>
        <Popper
          style={{ zIndex: 1000 }}
          open={open}
          anchorEl={buttonRef.current}
          placement="right"
          disablePortal
          modifiers={{
            flip: {
              enabled: false,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'scrollParent',
            },
          }}
        >
          <Paper style={{ marginLeft: theme.spacing(1), borderRadius: 10 }} elevation={0}>
            <List>
              <ListItem button onClick={onDelete}>
                <ListItemIcon>
                  <TrashIcon />
                </ListItemIcon>
                <ListItemText>
                  Delete
                </ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default Options;
