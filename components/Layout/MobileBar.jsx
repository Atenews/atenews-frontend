import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import imageGenerator from '@/utils/imageGenerator';
import { useAuth } from '@/utils/hooks/useAuth';

import postFetch from '@/utils/postFetch';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(12),
  },
  menuButton: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
  },
  account: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    right: 0,
    height: 65,
  },
  button: {
    height: 65,
    width: 65,
  },
  logo: {
    backgroundImage: theme.palette.mode === 'dark' ? 'url("/logo.png")' : 'url("/logo-blue.png")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: 40,
    height: 40,
  },
  list: {
    width: 250,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function MenuAppBar({ closeButtomNav, setDarkMode }) {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const { profile, logout } = useAuth();

  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [menus, setMenus] = React.useState([]);
  const [menuLoading, setMenuLoading] = React.useState(true);

  const [sideMenu, setSideMenu] = React.useState(false);
  const [profileMenu, setProfileMenu] = React.useState(false);

  const [openSubMenu, setOpenSubMenu] = React.useState(null);

  const flatListToHierarchical = (
    data = [],
    { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' } = {},
  ) => {
    const tree = [];
    const childrenOf = {};
    data.forEach((item) => {
      const newItem = { ...item };
      const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
      childrenOf[id] = childrenOf[id] || [];
      newItem[childrenKey] = childrenOf[id];
      if (parentId) {
        childrenOf[parentId] = childrenOf[parentId] || [];
        childrenOf[parentId].push(newItem);
      } else {
        tree.push(newItem);
      }
    });
    return tree;
  };

  React.useEffect(() => {
    setMenuLoading(true);
    postFetch('/api/graphql/getMenus').then((res) => res.json()).then((x) => {
      setMenus(flatListToHierarchical(x.menus));
      setMenuLoading(false);
    });
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenSubMenu(null);
    setSideMenu(open);
  };

  const toggleProfileMenu = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setProfileMenu(open);
  };

  const handleSubMenu = (submenu) => {
    if (openSubMenu === submenu) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(submenu);
    }
  };

  const handleClickLink = (url) => {
    setSideMenu(false);
    setProfileMenu(false);
    setOpenSubMenu(null);
    closeButtomNav();
    router.push(url);
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
    >
      <List>
        <ListItem button onClick={() => handleClickLink('/')}>
          <Grid container style={{ width: '100%' }} justifyContent="center">
            <Grid item>
              <div className={classes.logo} />
            </Grid>
          </Grid>
        </ListItem>
        { !menuLoading ? (
          <>
            {menus.map((menu) => (
              <div key={menu.id}>
                <ListItem key={`${menu.id}-item`} button onClick={() => handleSubMenu(menu.id)}>
                  <ListItemIcon>
                    <ChevronRightIcon />
                  </ListItemIcon>
                  <ListItemText primary={menu.label} />
                  { openSubMenu === menu.id ? <ExpandLess /> : <ExpandMore /> }
                </ListItem>
                <Collapse key={`${menu.id}-collapse`} in={openSubMenu === menu.id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.children.map((child) => (
                      <ListItem button key={child.id} className={classes.nested} onClick={() => handleClickLink(child.url.replace('https://atenews.ph', ''))}>
                        <ListItemIcon>
                          <ChevronRightIcon />
                        </ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            ))}
            <ListItem button onClick={() => handleClickLink('/staff')}>
              <ListItemIcon>
                <ChevronRightIcon />
              </ListItemIcon>
              <ListItemText primary="Staff" />
            </ListItem>
          </>
        ) : null }
      </List>
    </div>
  );

  const profileList = () => (
    <div
      className={classes.list}
      role="presentation"
    >
      <List
        subheader={(
          <ListSubheader component="div">
            User Settings
          </ListSubheader>
        )}
      >
        <ListItem button onClick={() => handleClickLink(`/profile/${profile.username}`)}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            logout();
            setSideMenu(false);
            setProfileMenu(false);
            setOpenSubMenu(null);
            closeButtomNav();
          }}
        >
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
      >
        {theme.palette.mode === 'dark' ? (
          <ListItem button onClick={() => setDarkMode(false)}>
            <ListItemIcon>
              <Brightness7Icon />
            </ListItemIcon>
            <ListItemText primary="Light Mode" />
          </ListItem>
        ) : (
          <ListItem button onClick={() => setDarkMode(true)}>
            <ListItemIcon>
              <NightsStayIcon />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar
        elevation={0}
        variant="outlined"
        style={{
          borderLeft: 0, borderRight: 0, borderTop: 0, backgroundColor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="primary"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Grid container style={{ width: '100%' }} justifyContent="center">
            <Grid item>
              <div className={classes.logo} />
            </Grid>
          </Grid>
          <div className={classes.account}>
            <IconButton
              className={classes.button}
              color="primary"
              onClick={toggleProfileMenu(true)}
              disabled={!profile}
              size="large"
            >
              {profile
                ? (
                  <Avatar
                    src={imageGenerator(profile.photoURL, 40)}
                    style={{ width: 40, height: 40 }}
                  />
                )
                : null}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Hidden mdUp>
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          anchor="left"
          open={sideMenu}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {list()}
        </SwipeableDrawer>
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          anchor="right"
          open={profileMenu}
          onClose={toggleProfileMenu(false)}
          onOpen={toggleProfileMenu(true)}
        >
          {profileList()}
        </SwipeableDrawer>
      </Hidden>
    </div>
  );
}
