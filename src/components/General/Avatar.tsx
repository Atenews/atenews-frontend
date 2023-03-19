import React from 'react';
import withStyles from '@mui/styles/withStyles';
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar';

// We can inject some CSS into the DOM.
const styles = {
  root: {
    width: '100%',
  },
};

interface Props extends AvatarProps {
  classes: {
    root: string;
  };
  children: React.ReactNode;
  className: string;
}

const Avatar: React.FC<Props> = (props) => {
  const {
    classes, children, className, ...other
  } = props;

  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setHeight(ref.current?.clientWidth ?? 0);
  });

  return (
    <MuiAvatar className={classes.root} style={{ height }} {...other}>
      {children || 'class names'}
    </MuiAvatar>
  );
};

export default withStyles(styles)(Avatar);
