import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSpring, animated } from 'react-spring';
import { CardActionArea } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  selector: {
    position: 'absolute',
    animation: '$showSelector 0.5s',
    top: 0,
    left: '-15vw',
    background: theme.palette.primary.main,
    height: 65,
    width: '30vw',
    zIndex: -1,
    borderRadius: 40,
    overflow: 'hidden',
  },
  menu: {
    display: 'flex',
    position: 'relative',
    width: '15vw',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    textDecoration: 'none',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
  },
  menuLabel: {
    color: 'white',
  },
  '@keyframes showSelector': {
    '0%': {
      transform: 'translatex(-100%)',
    },
    '100%': {
      transform: 'translatex(0px)',
    },
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: `10px solid ${theme.palette.primary.main}`,
    position: 'absolute',
    top: 20,
  },
}));

export default function Menu({
  color, children, label, active, onClick,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const [submenu, setSubmenu] = React.useState(false);
  const [currentColor, setCurrentColor] = React.useState(color);

  const [props, set] = useSpring(() => ({
    opacity: 0, borderRadius: 10, overflow: 'hidden', config: { duration: 80 },
  }));

  let timer = null;

  const handleHover = () => {
    clearTimeout(timer);
    setSubmenu(true);
    set({
      opacity: 1, borderRadius: 10, overflow: 'hidden', config: { duration: 80 },
    });
    setCurrentColor(theme.palette.primary.main);
  };

  const handleClose = () => {
    timer = setTimeout(() => {
      set({
        opacity: 0, borderRadius: 10, overflow: 'hidden', config: { duration: 80 },
      });
      setSubmenu(false);
      setCurrentColor(color);
    }, 50);
  };

  const colorGenerator = () => {
    if (active) {
      return 'white';
    }
    if (theme.palette.type === 'dark') {
      return 'white';
    }
    return theme.palette.primary.main;
  };

  return (
    <div
      className={classes.menu}
      onMouseOver={handleHover}
      onMouseLeave={handleClose}
    >
      <CardActionArea
        onClick={onClick}
        style={{ height: 65, borderTopRightRadius: 40, borderBottomRightRadius: 40 }}
      >
        { active
          ? <div className={classes.selector} style={{ background: currentColor }} />
          : null }
        <div
          className={classes.menuLabel}
          style={
            {
              color: colorGenerator(),
            }
          }
        >
          {label}
        </div>
      </CardActionArea>
      <animated.div style={props}>
        { submenu
          ? (
            <>
              { children ? <div className={classes.arrowLeft} /> : null }
              {children}
            </>
          )
          : null }
      </animated.div>
    </div>
  );
}
