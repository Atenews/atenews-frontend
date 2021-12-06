import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import { useError } from '@/utils/hooks/useSnackbar';
import imageGenerator from '@/utils/imageGenerator';
import { useArticle } from '@/utils/hooks/useArticle';

const useStyles = makeStyles(() => ({
  avatar: {
    height: 60,
    width: 60,
  },
}));

const IndividualWriter = ({ author }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { setError } = useError();
  const {
    writerImages: { writerImages: images },
    profiles: { profiles },
  } = useArticle();

  const [image, setImage] = React.useState('');

  React.useEffect(() => {
    setImage(images[author.databaseId]);
  }, [images]);

  const rolesIgnore = [
    'subscriber',
    'contributor',
    'administrator',
    'editor',
  ];

  const humanRole = (raw) => raw.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <ListItem
      button
      onClick={() => {
        if (profiles) {
          if (profiles[author.databaseId]) {
            router.push(`/profile/${profiles[author.databaseId].username}`);
          } else {
            setError('This member has yet to set up his/her profile!');
          }
        } else {
          setError('This member has yet to set up his/her profile!');
        }
      }}
      style={{ marginTop: theme.spacing(1) }}
      key={author.databaseId}
    >
      <ListItemAvatar>
        <Avatar className={classes.avatar} src={imageGenerator(image, 60)} />
      </ListItemAvatar>
      <ListItemText
        primary={`${author.firstName} ${author.lastName || ''}`}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={author.roles.nodes.map((role) => (!rolesIgnore.includes(role.name) ? (
          <Typography
            key={`indi_${role.name}`}
            variant="subtitle2"
            style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}
          >
            <i>{humanRole(role.name)}</i>
          </Typography>
        ) : null))}
        style={{ marginLeft: theme.spacing(2) }}
      />
    </ListItem>
  );
};

export default IndividualWriter;
