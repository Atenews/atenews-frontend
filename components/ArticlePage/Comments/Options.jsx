import React from 'react';

import { useTheme } from '@mui/material/styles';

import {
  MoreHoriz as MoreHorizIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

import {
  IconButton,
  Popper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  ClickAwayListener,
} from '@mui/material';

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
