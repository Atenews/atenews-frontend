import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import { format } from 'date-fns';

import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';

const useStyles = makeStyles(() => ({
  account: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    right: 0,
    marginRight: 20,
    height: 65,
  },
  avatar: {
    height: 60,
    width: 60,
  },
  readMore: {
    position: 'fixed',
    width: 'calc(15vw - 10px)',
    top: 'calc(65px + 8vh)',
    right: 10,
  },
  sideWriter: {
    position: 'fixed',
    width: 'calc(15vw - 10px)',
    top: 'calc(35px + 8vh)',
    right: 40,
  },
}));

export default function Page({ page }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.container}>
      <Hidden mdDown>
        <Typography variant="h3" component="h1" dangerouslySetInnerHTML={{ __html: page.title }} />
      </Hidden>
      <Hidden mdUp>
        <Typography variant="h4" component="h1" dangerouslySetInnerHTML={{ __html: page.title }} />
      </Hidden>
      <Typography variant="body2" style={{ marginTop: theme.spacing(1) }}>{format(new Date(page.date), 'MMMM d, yyyy')}</Typography>
      <Typography
        variant="body1"
        component="div"
        style={{
          marginTop: theme.spacing(2),
          lineHeight: '1.9em',
          width: '100%',
          color: theme.palette.text.primary,
        }}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
