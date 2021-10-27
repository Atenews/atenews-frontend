import React from 'react';
import withStyles from '@mui/styles/withStyles';
import { Button } from '@mui/material';

// We can inject some CSS into the DOM.
const styles = {
  root: {
    borderRadius: 40,
  },
};

function ClassNames(props) {
  const {
    classes, children, className, ...other
  } = props;

  return (
    <Button className={classes.root} {...other}>
      {children || 'class names'}
    </Button>
  );
}

export default withStyles(styles)(ClassNames);
