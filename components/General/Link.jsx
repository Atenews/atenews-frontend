import React from 'react';

import Link from 'next/link';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  link: {
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const LinkCustom = ({ children, href, color }) => {
  const classes = useStyles();

  return (
    <Link href={href} passHref>
      <a className={classes.link} style={{ color }}>
        {children}
      </a>
    </Link>
  );
};

export default LinkCustom;
