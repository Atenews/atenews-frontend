import React from 'react';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  viewContainer: {
    position: 'relative',
    marginTop: 10,
    padding: theme.spacing(2),
    borderRadius: 10,
  },
  arrowUp: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: `10px solid ${theme.palette.divider}`,
  },
  list: {
    width: '100%',
  },
}));

const PopoutView = ({ close, setDarkMode }) => {

  return null;
};

export default PopoutView;
