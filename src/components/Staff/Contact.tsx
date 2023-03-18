import React from 'react';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import MapIcon from '@mui/icons-material/PinDrop';

import { Typography, Grid, Hidden } from '@mui/material';

const useStyles = makeStyles(() => ({
  container: {
    position: 'fixed',
    width: 'calc(15vw - 10px)',
    right: 10,
  },
}));

const Contact = () => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Hidden mdDown>
      <div className={classes.container} style={{ top: 'calc(80px + 4vh)', color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>
        <Typography variant="h6" style={{ marginBottom: theme.spacing(2) }}>Contact Us</Typography>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <PhoneIcon />
              </Grid>
              <Grid item>
                <Typography variant="body2">221 2411 (Loc. 8332)</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <MailIcon />
              </Grid>
              <Grid item>
                <Typography variant="body2">atenews@addu.edu.ph</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} wrap="nowrap">
              <Grid item>
                <MapIcon />
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  Atenews Office, Ground Floor, Arrupe Hall,
                  Martin Building, Ateneo de Davao University, E. Jacinto St.,
                  {' '}
                  <b>8016 Davao City, Philippines</b>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Hidden>
  );
};

export default Contact;
