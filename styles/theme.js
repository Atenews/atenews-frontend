import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const themeGenerator = (dark) => createTheme({
  overrides: dark ? {
    MuiCssBaseline: {
      '@global': {
        a: {
          color: 'white',
        },
      },
    },
  } : {},
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: [
      'Open Sans',
    ].join(','),
    h1: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Montserrat',
      fontWeight: 600,
    },
  },
  palette: {
    type: dark ? 'dark' : 'light',
    primary: {
      main: '#195EA9',
    },
    secondary: {
      main: '#fff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: dark ? '#0e1621' : '#fff',
      paper: dark ? '#17212b' : '#fff',
    },
    atenews: {
      news: '#263E8E',
      features: '#FAB417',
      highlight: '#972E34',
      montage: '#40AE4B',
      diversions: '#F9761D',
    },
  },
});

export default themeGenerator;
