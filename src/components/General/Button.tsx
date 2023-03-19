import React from 'react';
import withStyles from '@mui/styles/withStyles';
import MuiButton, { ButtonProps } from '@mui/material/Button';

// We can inject some CSS into the DOM.
const styles = {
  root: {
    borderRadius: 40,
  },
};

interface Props extends ButtonProps {
  classes: {
    root: string;
  };
}

const Button: React.FC<Props> = (props) => {
  const {
    classes, children, className, ...other
  } = props;

  return (
    <MuiButton className={classes.root} {...other}>
      {children || 'class names'}
    </MuiButton>
  );
};

export default withStyles(styles)(Button);
