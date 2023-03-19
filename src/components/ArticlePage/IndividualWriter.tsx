import React from 'react';

import { useRouter } from 'next/router';

import handleViewport from 'react-in-viewport';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import NextLink from 'next/link';

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
  key: number | string;
}

const IndividualWriter: React.FC<Props> = (props) => {
  const {
    author, key,
  } = props;

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

  const humanRole = (raw: string) => raw.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <Grid item key={key}>
      <CardActionArea
        LinkComponent={NextLink}
        disabled
        style={{ marginBottom: theme.spacing(2), padding: theme.spacing(2) }}
      >
        <Grid container direction="row" alignItems="center" spacing={2} component="div" key={author.databaseId} wrap="nowrap">
          <Grid item>
            <Avatar className={classes.avatar} src={imageGenerator(author.avatar?.url ?? '', 60)} />
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center">
              <Grid item>
                <Typography variant="body1">
                  {`${author.firstName} ${author.lastName || ''}`}
                </Typography>
              </Grid>
              <Grid item>
                {author.roles?.nodes.map((role) => (!rolesIgnore.includes(role.name) ? (
                  <Typography key={role.name} variant="subtitle2" style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}><i>{humanRole(role.name)}</i></Typography>
                ) : null)) }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardActionArea>
    </Grid>
  );
};

export default handleViewport(IndividualWriter);
