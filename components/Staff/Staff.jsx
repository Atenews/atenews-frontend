import React from 'react';

import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import Avatar from '@mui/material/Avatar';

import { useError } from '@/utils/hooks/useSnackbar';
import imageGenerator from '@/utils/imageGenerator';
import { rolesIgnore } from '@/utils/constants';

const useStyles = makeStyles((theme) => ({
  trendingItem: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  trendingStats: {
    width: '100%',
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
    padding: theme.spacing(0.5),
  },
  trendingStatsText: {
    fontSize: '0.8rem',
  },
  twoLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  threeLineText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  avatar: {
    height: 80,
    width: 80,
  },
}));

const Column = ({ details }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const [image, setImage] = React.useState('');
  const [username, setUsername] = React.useState('');

  const { setError } = useError();

  const humanRole = (raw) => raw.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <CardActionArea
      onClick={() => {
        if (username) {
          router.push(`/profile/${username}`);
        } else {
          setError('This member has yet to set up his/her profile!');
        }
      }}
      style={{
        marginTop: theme.spacing(1),
        borderRadius: 15,
      }}
    >
      <Paper elevation={0} className={classes.trendingItem}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar className={classes.avatar} src={imageGenerator(image, 80)} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{details.display_name}</Typography>
            {details.roles.map((role) => (!rolesIgnore.includes(role) ? (
              <Typography variant="body1" style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>{humanRole(role)}</Typography>
            ) : null)) }
          </Grid>
        </Grid>
      </Paper>
    </CardActionArea>
  );
};

export default Column;
