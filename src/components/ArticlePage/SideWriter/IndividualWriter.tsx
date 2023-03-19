import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import NextLink from 'next/link';

import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import { useError } from '@/utils/hooks/useSnackbar';
import imageGenerator from '@/utils/imageGenerator';

const useStyles = makeStyles(() => ({
  avatar: {
    height: 60,
    width: 60,
  },
}));

interface Props {
  author: Author;
}

const IndividualWriter: React.FC<Props> = ({ author }) => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { setError } = useError();

  const [image, setImage] = React.useState('');

  const rolesIgnore = [
    'subscriber',
    'contributor',
    'administrator',
    'editor',
  ];

  const humanRole = (raw: string) => raw.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <ListItemButton
      LinkComponent={NextLink}
      disabled
      style={{ marginTop: theme.spacing(1) }}
      key={author.databaseId}
    >
      <ListItemAvatar>
        <Avatar className={classes.avatar} src={imageGenerator(image, 60)} />
      </ListItemAvatar>
      <ListItemText
        primary={`${author.firstName} ${author.lastName || ''}`}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={author.roles?.nodes.map((role) => (!rolesIgnore.includes(role.name) ? (
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
    </ListItemButton>
  );
};

export default IndividualWriter;
