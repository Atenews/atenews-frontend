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

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  color?: string;
}

const LinkCustom: React.FC<Props> = ({ children, href, color }) => {
  const classes = useStyles();

  return (
    <Link href={href} passHref legacyBehavior>
      <a className={classes.link} style={{ color }}>
        {children}
      </a>
    </Link>
  );
};

export default LinkCustom;
