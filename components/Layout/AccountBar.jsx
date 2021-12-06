import React from 'react';

import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';

import BellIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';

import { useSpring, animated } from 'react-spring';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import StockTextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Badge from '@mui/material/Badge';

import { useAuth } from '@/utils/hooks/useAuth';
import imageGenerator from '@/utils/imageGenerator';

import NotificationView from '@/components/Layout/Popouts/Notification';
import ProfileView from '@/components/Layout/Popouts/Profile';

const TextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 30,
      },
    },
  },
})(StockTextField);

const useStyles = makeStyles((theme) => ({
  account: {
    position: 'fixed',
    right: 0,
    marginRight: '0.5vw',
    height: 65,
    zIndex: 1100,
    width: '15vw',
    background: theme.palette.background.default,
  },
  button: {
    height: 65,
    width: 65,
  },
  search: {
    height: 105,
    position: 'fixed',
    backgroundColor: theme.palette.background.default,
    right: 'calc(15vw + 20px)',
    top: 0,
    zIndex: 1100,
  },
}));

export default function AccountBar({ setDarkMode }) {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const [accountActive, setAccountActive] = React.useState(false);
  const [notifActive, setNotifActive] = React.useState(false);

  const [props, set] = useSpring(() => ({ width: '0vw', opacity: 0 }));
  const [accountProps, setAccountProps] = useSpring(() => ({
    opacity: 0,
  }));
  const [notifProps, setNotifProps] = useSpring(() => ({
    opacity: 0,
  }));
  const [searchOpened, setSearchOpened] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const {
    profile,
    setFormOpen,
    formOpen,
    newNotif,
    setNewNotif,
  } = useAuth();

  const searchBar = React.useRef();
  const notifButton = React.useRef();
  const accountButton = React.useRef();

  const closeAccount = () => setAccountProps({
    opacity: 0,
    onRest: setAccountActive(false),
  });

  const openAccount = () => setAccountProps({
    opacity: 1,
    config: {
      duration: 100,
    },
    onStart: setAccountActive(true),
  });

  const closeNotif = () => setNotifProps({
    opacity: 0,
    onRest: setNotifActive(false),
  });

  const openNotif = () => setNotifProps({
    opacity: 1,
    config: {
      duration: 100,
    },
    onStart: setNotifActive(true),
  });

  React.useEffect(() => {
    if (formOpen) {
      openAccount();
    } else {
      closeAccount();
    }
  }, [formOpen]);

  React.useEffect(() => {
    if (accountActive) {
      setFormOpen(true);
      setNotifActive(false);
    } else {
      setFormOpen(false);
    }
  }, [accountActive]);

  React.useEffect(() => {
    if (notifActive) {
      openNotif();
      setFormOpen(false);
      setNewNotif(0);
    } else {
      closeNotif();
    }
  }, [notifActive]);

  const handleClose = () => {
    closeNotif();
    setFormOpen(false);
    if (searchOpened) {
      set({ width: '0vw', opacity: 0 });
      setSearchOpened(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <animated.div className={classes.search} style={props}>
          <Grid container alignItems="center" style={{ height: '100%' }}>
            <Grid item xs>
              <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?query=${search}`); }}>
                <TextField
                  variant="outlined"
                  placeholder="Search Atenews"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <IconButton type="submit" aria-label="Search" size="large">
                          <SearchIcon color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputRef={searchBar}
                />
              </form>
            </Grid>
          </Grid>
        </animated.div>
        <Grid component="div" container className={classes.account} justifyContent="space-around" alignItems="center" wrap="nowrap">
          <Grid item>
            <IconButton
              aria-label="Open Search Bar"
              className={classes.button}
              color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
              onClick={() => {
                if (searchOpened) {
                  set({ width: '0vw', opacity: 0 });
                  setSearchOpened(false);
                } else {
                  searchBar.current.focus();
                  set({ width: '66vw', opacity: 1 });
                  setSearchOpened(true);
                }
              }}
              size="large"
            >
              <SearchIcon />
            </IconButton>
          </Grid>
          {profile
            ? (
              <Grid item>
                <IconButton
                  aria-label="Open notifications"
                  className={classes.button}
                  ref={notifButton}
                  color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                  onClick={() => setNotifActive((prev) => !prev)}
                  size="large"
                >
                  <Badge color="primary" badgeContent={newNotif}>
                    <BellIcon />
                  </Badge>
                </IconButton>
              </Grid>
            )
            : null}
          <Grid item>
            { profile ? (
              <IconButton
                aria-label="Open account settings"
                ref={accountButton}
                className={classes.button}
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                onClick={() => setAccountActive((prev) => !prev)}
                size="large"
              >
                <Avatar
                  src={imageGenerator(profile.photoURL, 40)}
                  style={{ width: 40, height: 40 }}
                />
              </IconButton>
            ) : (
              <Button
                aria-label="Open account settings"
                ref={accountButton}
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                onClick={() => setAccountActive((prev) => !prev)}
              >
                Login
              </Button>
            ) }
          </Grid>
          <Popper
            open
            anchorEl={notifButton.current}
            placement="bottom-end"
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
            <animated.div style={notifProps}>
              {notifActive ? (
                <NotificationView />
              ) : null}
            </animated.div>
          </Popper>

          <Popper
            open
            anchorEl={accountButton.current}
            placement="bottom-end"
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
            <animated.div style={accountProps}>
              {accountActive ? (
                <ProfileView close={handleClose} setDarkMode={setDarkMode} />
              ) : null}
            </animated.div>
          </Popper>
        </Grid>
      </div>
    </ClickAwayListener>
  );
}
