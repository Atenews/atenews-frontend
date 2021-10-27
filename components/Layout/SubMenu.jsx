import React from 'react';
import { makeStyles } from '@mui/styles';
import { CardActionArea } from '@mui/material';

const useStyles = makeStyles({
  menu: {
    display: 'flex',
    width: '15vw',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    textDecoration: 'none',
    color: 'white',
    background: '#195EA9',
  },
  menuLabel: {
    color: 'white',
  },
});

export default function Menu({
  children, label, onClick,
}) {
  const classes = useStyles();

  const [submenu, setSubmenu] = React.useState(false);

  const handleHover = () => {
    setSubmenu(true);
  };

  const handleClose = () => {
    setSubmenu(false);
  };

  return (
    <div className={classes.menu} onMouseOver={handleHover} onMouseLeave={handleClose}>
      <CardActionArea onClick={onClick} style={{ height: 65 }}>
        <div className={classes.menuLabel}>
          {label}
        </div>
      </CardActionArea>
      <div style={{ visibility: submenu ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
