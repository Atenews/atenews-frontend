import React from 'react';

import { useRouter } from 'next/router';

import handleViewport from 'react-in-viewport';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import {
  Typography,
  Avatar,
  Grid,
  CardActionArea,
} from '@mui/material';

import { useError } from '@/utils/hooks/useSnackbar';
import { useArticle } from '@/utils/hooks/useArticle';

import useFirestore from '@/utils/hooks/useFirestore';
import imageGenerator from '@/utils/imageGenerator';

const useStyles = makeStyles(() => ({
  avatar: {
    height: 60,
    width: 60,
  },
}));

export default handleViewport((props) => {
  const {
    author, key,
  } = props;

  const {
    writerImages: { setWriterImages },
    profiles: { setProfiles, profiles },
  } = useArticle();

  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { setError } = useError();

  const rolesIgnore = [
    'subscriber',
    'contributor',
    'administrator',
    'editor',
  ];

  const [image, setImage] = React.useState('');

  const { getDocumentOnce } = useFirestore();

  React.useEffect(() => {
    getDocumentOnce(`wordpress/${author.databaseId}`).then(async (wpFirebaseId) => {
      if (wpFirebaseId) {
        const profile = await getDocumentOnce(`users/${wpFirebaseId.id}`);
        setProfiles((prev) => ({ ...prev, [author.databaseId]: profile }));
        setImage(profile.photoURL);
        setWriterImages((prev) => ({ ...prev, [author.databaseId]: profile.photoURL }));
      } else {
        setImage(author.avatar.url);
        setWriterImages((prev) => ({ ...prev, [author.databaseId]: author.avatar.url }));
      }
    });
  }, []);

  const humanRole = (raw) => raw.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <Grid item key={key}>
      <CardActionArea
        style={{ marginBottom: theme.spacing(2), padding: theme.spacing(2) }}
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
      >
        <Grid container direction="row" alignItems="center" spacing={2} component="div" key={author.databaseId} wrap="nowrap">
          <Grid item>
            <Avatar className={classes.avatar} src={imageGenerator(image, 60)} />
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center">
              <Grid item>
                <Typography variant="body1">
                  {`${author.firstName} ${author.lastName || ''}`}
                </Typography>
              </Grid>
              <Grid item>
                {author.roles.nodes.map((role) => (!rolesIgnore.includes(role.name) ? (
                  <Typography key={role.name} variant="subtitle2" style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}><i>{humanRole(role.name)}</i></Typography>
                ) : null)) }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardActionArea>
    </Grid>
  );
});
