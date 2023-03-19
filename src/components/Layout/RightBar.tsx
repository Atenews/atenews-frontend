import React from 'react';

import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';

import SearchIcon from '@mui/icons-material/Search';

import { useSpring, animated } from 'react-spring';

import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import StockTextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Brightness7Icon from '@mui/icons-material/Brightness7';
import NightsStayIcon from '@mui/icons-material/NightsStay';

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
    width: '15vw !important',
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

interface Props {
  setDarkMode: (darkMode: boolean) => void;
}

const RightBar: React.FC<Props> = ({ setDarkMode }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const [props, api] = useSpring(() => ({ width: '0vw', opacity: 0 }));
  const [searchOpened, setSearchOpened] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const searchBar = React.useRef<HTMLInputElement>();

  return (
    <>
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
                    <InputAdornment position="end">
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
      <Grid container className={classes.account} justifyContent="space-around" alignItems="center" wrap="nowrap">
        <Grid item>
          <IconButton
            aria-label="Open Search Bar"
            className={classes.button}
            color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
            onClick={() => {
              if (searchOpened) {
                api.start({ width: '0vw', opacity: 0 });
                setSearchOpened(false);
              } else {
                searchBar.current?.focus();
                api.start({ width: '66vw', opacity: 1 });
                setSearchOpened(true);
              }
            }}
            size="large"
          >
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item>
          {
            theme.palette.mode === 'dark' ? (
              <IconButton
                aria-label="Enable Light Mode"
                className={classes.button}
                color="secondary"
                onClick={() => { setDarkMode(false); }}
                size="large"
              >
                <Brightness7Icon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="Enable Dark Mode"
                className={classes.button}
                color="primary"
                onClick={() => { setDarkMode(true); }}
                size="large"
              >
                <NightsStayIcon />
              </IconButton>
            )
          }
        </Grid>
      </Grid>
    </>
  );
};

export default RightBar;
