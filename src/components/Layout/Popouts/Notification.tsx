import React from 'react';
import { makeStyles } from '@mui/styles';

import AnnouncementIcon from '@mui/icons-material/Announcement';

import { useRouter } from 'next/router';

import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';

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
}));

const PopoutView = () => null;

/*
  return (
    <Paper variant="outlined" className={classes.viewContainer}>
      <div className={classes.arrowUp} />
      <List subheader={<ListSubheader>Recent Notifications</ListSubheader>}>
        {notifications.slice(0, 3).map((notification, i) => (
          <ListItem
            key={`${notification.slug}_${i}`}
            button
            onClick={() => {
              router.push(`/${notification.slug}`);
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <AnnouncementIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={notification.title} secondary={notification.description} />
          </ListItem>
        ))}
        <Button fullWidth variant="text" onClick={clearNotifs}>Clear Notifications</Button>
      </List>
    </Paper>
  );
  */

export default PopoutView;
