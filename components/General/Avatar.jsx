import React from 'react';
import withStyles from '@mui/styles/withStyles';
import { Avatar } from '@mui/material';

// We can inject some CSS into the DOM.
const styles = {
  root: {
    width: '100%',
  },
};

function ClassNames(props) {
  const {
    classes, children, className, ...other
  } = props;

  const [height, setHeight] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    setHeight(ref.current.clientWidth);
  });

  return (
    <Avatar className={classes.root} style={{ height }} {...other}>
      {children || 'class names'}
    </Avatar>
  );
}

export default withStyles(styles)(ClassNames);
