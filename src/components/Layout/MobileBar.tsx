import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import NextLink from 'next/link';

import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import Hidden from '@mui/material/Hidden';

import trpc from '@/utils/trpc';

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

export default function MenuAppBar({ closeButtomNav }) {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();

  const iOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [menus, setMenus] = React.useState<any[]>([]);
  const [menuLoading, setMenuLoading] = React.useState(true);

  const [sideMenu, setSideMenu] = React.useState(false);

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

  const trpcMenus = trpc.useContext().menus;

  React.useEffect(() => {
    setMenuLoading(true);
    trpcMenus.fetch().then((x) => {
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

  const handleSubMenu = (submenu) => {
    if (openSubMenu === submenu) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(submenu);
    }
  };

  const handleClickLink = (e, url) => {
    e.preventDefault();
    setSideMenu(false);
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
        <ListItemButton LinkComponent={NextLink} href="/" onClick={(e) => handleClickLink(e, '/')}>
          <Grid container style={{ width: '100%' }} justifyContent="center">
            <Grid item>
              <div className={classes.logo} />
            </Grid>
          </Grid>
        </ListItemButton>
        { !menuLoading ? (
          <>
            {menus.map((menu) => (
              <div key={menu.id}>
                <ListItemButton key={`${menu.id}-item`} onClick={() => handleSubMenu(menu.id)}>
                  <ListItemIcon>
                    <ChevronRightIcon />
                  </ListItemIcon>
                  <ListItemText primary={menu.label} />
                  { openSubMenu === menu.id ? <ExpandLess /> : <ExpandMore /> }
                </ListItemButton>
                <Collapse key={`${menu.id}-collapse`} in={openSubMenu === menu.id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.children.map((child) => (
                      <ListItemButton LinkComponent={NextLink} key={child.id} className={classes.nested} href={child.url.replace('https://atenews.ph', '')} onClick={(e) => handleClickLink(e, child.url.replace('https://atenews.ph', ''))}>
                        <ListItemIcon>
                          <ChevronRightIcon />
                        </ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </div>
            ))}
            <ListItemButton LinkComponent={NextLink} href="/staff" onClick={(e) => handleClickLink(e, '/staff')}>
              <ListItemIcon>
                <ChevronRightIcon />
              </ListItemIcon>
              <ListItemText primary="Staff" />
            </ListItemButton>
          </>
        ) : null }
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
      </Hidden>
    </div>
  );
}
