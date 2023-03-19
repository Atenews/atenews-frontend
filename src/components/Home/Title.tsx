import React from 'react';
import { makeStyles } from '@mui/styles';

import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    marginBottom: theme.spacing(4),
  },
  title: {
    color: '#ffffff',
    height: 65,
    borderRadius: 10,
  },
  design: {
    position: 'absolute',
    top: 0,
    right: 'calc(-15vw - 2.5vw)',
    color: '#ffffff',
    width: '15vw',
    height: 65,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  small?: boolean;
  avatar?: boolean;
}

const Title: React.FC<Props> = ({
  color, children, small, avatar,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        className={classes.title}
        style={{ backgroundColor: color, height: !small && !avatar ? 65 : 40 }}
      >
        <Typography style={{ paddingLeft: !small && !avatar ? 40 : 20, paddingTop: !small && !avatar ? 10 : 5 }} variant={!small && !avatar ? 'h4' : 'h6'}>{ children }</Typography>
      </div>
      {/*
        <div className={classes.design} style={{ backgroundColor: color }}/>
      */}
    </div>
  );
};

export default Title;
