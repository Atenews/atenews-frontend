import React from 'react';

import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  link: {
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    textDecoration: 'none',
    color: 'black'
  }
}));


const LinkCustom = ({ children, href }) => {
  const classes = useStyles();

  return (
    <Link href={href} passHref>
      <a className={classes.link}>
        {children}
      </a>
    </Link>
  )
}

export default LinkCustom;