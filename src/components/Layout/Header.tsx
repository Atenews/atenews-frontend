import React from 'react';
import { makeStyles } from '@mui/styles';
import dynamic from 'next/dynamic';

const Navigation = dynamic(import('@/components/Layout/Navigation'));
const RightBar = dynamic(import('@/components/Layout/RightBar'));
const MobileBar = dynamic(import('@/components/Layout/MobileBar'));

const useStyles = makeStyles((theme) => ({
  margin: {
    position: 'fixed',
    width: '15.5vw',
    height: 85,
    right: 0,
    top: 0,
    zIndex: 1100,
    background: theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  container: {
    marginTop: 20,
  },
  desktop: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  mobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function Header({ closeButtomNav, setDarkMode }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.margin} />
      <div className={classes.desktop}>
        <Navigation />
        <RightBar setDarkMode={setDarkMode} />
      </div>
      <div className={classes.mobile}>
        <MobileBar closeButtomNav={closeButtomNav} setDarkMode={setDarkMode} />
      </div>
    </div>
  );
}
