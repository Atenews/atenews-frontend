import React from 'react';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import { useAuth } from '@/utils/hooks/useAuth';
import AuthForm from '@/components/Auth/AuthForm';

import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  viewContainer: {
    position: 'relative',
    marginTop: 10,
    padding: theme.spacing(2),
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
  list: {
    width: '100%',
  },
}));

const PopoutView = ({ close, setDarkMode }) => {
  const classes = useStyles();
  const {
    authUser,
    profile,
    logout,
  } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  if (authUser) {
    return (
      <Paper variant="outlined" className={classes.viewContainer}>
        <div className={classes.arrowUp} />
        <List
          subheader={(
            <ListSubheader component="div">
              User Settings
            </ListSubheader>
          )}
          className={classes.list}
        >
          <ListItem button onClick={() => { router.push(`/profile/${profile.username}`); close(); }}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => { logout(); close(); }}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
        { profile?.staff ? (
          <>
            <Divider />
            <List
              subheader={(
                <ListSubheader component="div">
                  Admin Settings
                </ListSubheader>
            )}
            >
              <ListItem button onClick={() => { window.location = 'https://wp.atenews.ph/admin-login'; }}>
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </List>
          </>
        ) : null }
        <Divider />
        <List
          subheader={(
            <ListSubheader component="div">
              Theme Settings
            </ListSubheader>
          )}
          className={classes.list}
        >
          { theme.palette.mode === 'dark' ? (
            <ListItem button onClick={() => { setDarkMode(false); }}>
              <ListItemIcon>
                <Brightness7Icon />
              </ListItemIcon>
              <ListItemText primary="Light Mode" />
            </ListItem>
          ) : (
            <ListItem button onClick={() => { setDarkMode(true); }}>
              <ListItemIcon>
                <NightsStayIcon />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
            </ListItem>
          )}
        </List>
      </Paper>
    );
  }

  return <AuthForm close={close} />;
};

export default PopoutView;
