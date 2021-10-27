import React from 'react';
import { makeStyles } from '@mui/styles';

import { Star as StarIcon } from '@mui/icons-material';

import { Grid, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  tag: {
    width: 'max-content',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    height: 25,
    color: 'white',
    textAlign: 'center',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: theme.palette.atenews.highlight,
  },
}));

const Flair = ({ small }) => {
  const classes = useStyles();

  return (
    <div className={classes.tag} style={small ? { height: 20 } : null}>
      <Typography variant="body2" component="div" style={small ? { fontSize: 10 } : null}>
        <Grid container spacing={1} alignItems="center" wrap="nowrap" justifyContent="center" style={{ height: 'max-content' }}>
          <Grid item>
            <Grid container>
              <StarIcon style={small ? { fontSize: 18 } : null} />
            </Grid>
          </Grid>
          <Grid item xs>
            <b>Staff</b>
          </Grid>
        </Grid>
      </Typography>
    </div>
  );
};

export default Flair;
