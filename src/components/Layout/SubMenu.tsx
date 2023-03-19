import React from 'react';
import { makeStyles } from '@mui/styles';
import { CardActionArea } from '@mui/material';
import NextLink from 'next/link';

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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  label: string | React.ReactNode;
  href: string;
}

const SubMenu: React.FC<Props> = ({
  children, label, href,
}) => {
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
      <CardActionArea
        LinkComponent={NextLink}
        href={href}
        style={{
          height: 65,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className={classes.menuLabel}>
          {label}
        </div>
      </CardActionArea>
      <div style={{ visibility: submenu ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </div>
  );
};

export default SubMenu;
