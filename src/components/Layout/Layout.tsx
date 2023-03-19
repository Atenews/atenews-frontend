import React, { KeyboardEventHandler } from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { useRouter } from 'next/router';
import trpc from '@/utils/trpc';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';

import Hidden from '@mui/material/Hidden';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import StockTextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';

import Brightness7Icon from '@mui/icons-material/Brightness7';
import NightsStayIcon from '@mui/icons-material/NightsStay';

import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import { ListItemButton } from '@mui/material';

import { useTheme as useNextTheme } from 'next-themes';

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
  layoutContainer: {
    width: '100%',
    overflowX: 'hidden',
  },
  contentContainer: {
    width: '50%',
    [theme.breakpoints.down('lg')]: {
      width: '60%',
    },
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
    margin: 'auto',
    minHeight: 500,
  },
  homeContainer: {
    width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
    minHeight: 500,
    margin: 'auto',
  },
  root: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 1100,
    borderRadius: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: 0,
  },
  appBar: {
    position: 'relative',
    height: 65,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  trendingHead: {
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
    padding: 20,
    height: 65,
    textAlign: 'center',
    width: '100%',
    border: 0,
  },
  trendingItem: {
    position: 'relative',
    width: '100%',
    borderBottom: 0,
    borderLeft: 0,
    borderRight: 0,
    padding: theme.spacing(2.5),
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
}));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  setDarkMode: (darkMode: boolean) => void;
  darkMode: boolean;
}

// TODO: Fix types
const Layout: React.FC<Props> = ({ children, setDarkMode, darkMode }) => {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const menuQuery = trpc.menus.useQuery();

  const { setTheme: setNextTheme } = useNextTheme();

  React.useEffect(() => {
    if (darkMode) {
      setNextTheme('dark');
    } else {
      setNextTheme('light');
    }
  }, [darkMode]);

  const [isLargeWidth, setIsLargeWidth] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const baseUrlMenu = (url: string) => url.split('?')[0];

  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState('');

  const submitSearch = () => {
    router.push(`/search?query=${search}`);
    setValue(0);
    setOpen(false);
  };

  const handleKeyPress: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  React.useEffect(() => {
    if (menuQuery.isFetched) {
      const menus = menuQuery.data?.menus.map((menu) => menu.url.replace('https://atenews.ph', '')) || [];
      const largerWidthPages = [
        '/',
        ...menus,
        '/search',
      ];
      if (largerWidthPages.includes(baseUrlMenu(router.asPath))) {
        setIsLargeWidth(true);
      } else {
        setIsLargeWidth(false);
      }
    }
  }, [router.pathname, menuQuery.isFetched]);

  return (
    <div className={classes.layoutContainer}>
      <Header
        closeButtomNav={() => {
          setValue(0);
          setOpen(false);
        }}
        setDarkMode={setDarkMode}
      />
      <div className={isLargeWidth ? classes.homeContainer : classes.contentContainer}>
        {children}
        <Footer />
      </div>
      <Hidden mdUp>
        <div style={{ height: theme.spacing(8) }} />
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            if (newValue === 0 && value !== newValue) {
              setOpen(false);
            } else if (newValue === 0 && value === newValue) {
              router.push('/');
            } else {
              setOpen(true);
            }
          }}
          showLabels
          className={classes.root}
          component={Paper}
          variant="outlined"
        >
          <BottomNavigationAction onClick={() => setValue(0)} icon={<HomeIcon />} />
          <BottomNavigationAction onClick={() => setValue(1)} icon={<SearchIcon />} />
          <BottomNavigationAction onClick={() => setValue(2)} icon={<Settings />} />
        </BottomNavigation>

        <Dialog fullScreen open={open} style={{ zIndex: 1000 }}>
          <AppBar className={classes.appBar} color="default" elevation={0} />
          <Paper elevation={0} style={{ padding: theme.spacing(2), paddingBottom: 70, height: '100%' }}>
            { value === 1
              ? (
                <>
                  <TextField
                    variant="outlined"
                    placeholder="Search Atenews"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={submitSearch} size="large">
                            <SearchIcon color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    autoFocus
                  />
                  <Grid container spacing={0} component={Paper} variant="outlined" justifyContent="center" style={{ borderRadius: 10, overflow: 'hidden', marginTop: theme.spacing(4) }}>
                    <Paper variant="outlined" square className={classes.trendingHead}>
                      <Typography variant="h5">Trending</Typography>
                    </Paper>
                    <Grid item>
                      <Typography variant="body1" style={{ marginBottom: '2rem' }}>Under construction.</Typography>
                    </Grid>
                  </Grid>
                </>
              )
              : null }
            { value === 2
              ? (
                <Grid container spacing={0} component={Paper} variant="outlined" style={{ borderRadius: 10, overflow: 'hidden', marginTop: theme.spacing(4) }}>
                  <Paper variant="outlined" square className={classes.trendingHead}>
                    <Typography variant="h5">Settings</Typography>
                  </Paper>
                  <List
                    subheader={(
                      <ListSubheader component="div">
                        Theme Settings
                      </ListSubheader>
                    )}
                    style={{
                      width: '100%',
                    }}
                  >
                    { theme.palette.mode === 'dark' ? (
                      <ListItemButton onClick={() => { setDarkMode(false); }}>
                        <ListItemIcon>
                          <Brightness7Icon />
                        </ListItemIcon>
                        <ListItemText primary="Light Mode" />
                      </ListItemButton>
                    ) : (
                      <ListItemButton onClick={() => { setDarkMode(true); }}>
                        <ListItemIcon>
                          <NightsStayIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dark Mode" />
                      </ListItemButton>
                    )}
                  </List>
                </Grid>
              )
              : null }
          </Paper>
        </Dialog>
      </Hidden>
    </div>
  );
};

export default Layout;
