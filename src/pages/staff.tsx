// import React from 'react';

import { NextSeo } from 'next-seo';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import MapIcon from '@mui/icons-material/PinDrop';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';

import Contact from '@/components/Staff/Contact';
import Staff from '@/components/Staff/Staff';

import { appRouter } from '@/server/routers/_app';

import { rolesIgnore as _rolesIgnore } from '@/utils/constants';
import { GetServerSideProps, NextPage } from 'next';

import { createCallerFactory } from '@/server/trpc';

const useStyles = makeStyles((theme) => ({
  container: {
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    height: 65,
    padding: 5,
  },
}));

const StaffPage: NextPage<{ staffs: Staff[] }> = ({ staffs: staffsRaw }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [editors, setEditors] = React.useState<Staff[]>([]);
  const [seniors, setSeniors] = React.useState<Staff[]>([]);
  const [juniors, setJuniors] = React.useState<Staff[]>([]);
  const [trainees, setTrainees] = React.useState<Staff[]>([]);

  React.useEffect(() => {
    const rolesIgnore = [
      ..._rolesIgnore,
      'editor-in-chief',
      'associate_editor',
      'managing_editor',
    ];
    const sortByPosition = (a: Staff, b: Staff) => {
      const aCleanRoles = a.roles.filter((role) => !rolesIgnore.includes(role));
      const bCleanRoles = b.roles.filter((role) => !rolesIgnore.includes(role));
      if (aCleanRoles[0] < bCleanRoles[0]) { return -1; }
      if (aCleanRoles[0] > bCleanRoles[0]) { return 1; }
      return 0;
    };

    const nonBigThreeEditors = staffsRaw.filter((staff) => {
      let isIncluded = false;
      if (staff.roles.includes('editor')) {
        isIncluded = true;
        if (staff.roles.includes('editor-in-chief') || staff.roles.includes('associate_editor') || staff.roles.includes('managing_editor')) {
          isIncluded = false;
        }
      }

      return isIncluded;
    });

    setEditors([
      ...staffsRaw.filter((staff) => (staff.roles.includes('editor-in-chief'))),
      ...staffsRaw.filter((staff) => (staff.roles.includes('associate_editor'))),
      ...staffsRaw.filter((staff) => (staff.roles.includes('managing_editor'))),
      ...nonBigThreeEditors,
    ]);

    setSeniors(staffsRaw.filter((staff) => {
      const cleanRoles = staff.roles.filter((role) => !rolesIgnore.includes(role));

      let isIncluded = false;
      cleanRoles.forEach((role) => {
        if (role.toLowerCase().includes('senior') || role.toLowerCase().includes('head')) {
          isIncluded = true;
        }
      });

      return cleanRoles.length > 0 && isIncluded;
    }).sort(sortByPosition));

    setJuniors(staffsRaw.filter((staff) => {
      const cleanRoles = staff.roles.filter((role) => !rolesIgnore.includes(role));

      let isIncluded = false;
      cleanRoles.forEach((role) => {
        if (role.toLowerCase().includes('junior')) {
          isIncluded = true;
        }
      });

      return cleanRoles.length > 0 && isIncluded;
    }).sort(sortByPosition));

    setTrainees(staffsRaw.filter((staff) => {
      const cleanRoles = staff.roles.filter((role) => !rolesIgnore.includes(role));

      let isIncluded = false;
      cleanRoles.forEach((role) => {
        if (role.toLowerCase().includes('trainee')) {
          isIncluded = true;
        }
      });

      return cleanRoles.length > 0 && isIncluded;
    }).sort(sortByPosition));
  }, [staffsRaw]);

  return (
    <div className={classes.container}>
      <NextSeo
        title="Staff - Atenews"
        description="Welcome to the official student publication of AdDU. Here is a list of the current staff of Atenews."
      />
      <div className={classes.header}>
        <img src={theme.palette.mode === 'dark' ? '/atenews-footer.svg' : '/atenews-header.svg'} alt="Atenews Header" height="35" />
        <Typography variant="subtitle2" style={{ fontSize: '0.7rem' }}>
          The official student publication of the Ateneo de Davao University
        </Typography>
      </div>
      <Contact />
      <Typography variant="h4" style={{ marginBottom: theme.spacing(2) }}>About</Typography>
      <Typography variant="body1" component="div" style={{ marginBottom: theme.spacing(4) }}>
        <b style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>Atenews</b>
        {' '}
        is the official student publication of Ateneo de Davao University that
        aims to advance students&apos; level of consciousness on significant
        university and socially relevant issues and on matters of general
        concern by publishing online articles, tabloids, magazines, and other forms of releases.
      </Typography>

      <Typography variant="h4" style={{ marginBottom: theme.spacing(2) }}>Editorial Board</Typography>

      <Grid container spacing={2}>
        { editors.map((staff) => (
          <Grid item xs={12} sm={6} key={`editors_${staff.id}`}>
            <Staff details={staff} />
          </Grid>
        )) }
      </Grid>

      <Typography variant="h4" style={{ marginBottom: theme.spacing(2), marginTop: theme.spacing(4) }}>Senior Staff</Typography>

      <Grid container spacing={2}>
        { seniors.map((staff) => (
          <Grid item xs={12} sm={6} key={`seniors_${staff.id}`}>
            <Staff details={staff} />
          </Grid>
        )) }
      </Grid>

      <Typography variant="h4" style={{ marginBottom: theme.spacing(2), marginTop: theme.spacing(4) }}>Junior Staff</Typography>

      <Grid container spacing={2}>
        { juniors.map((staff) => (
          <Grid item xs={12} sm={6} key={`juniors_${staff.id}`}>
            <Staff details={staff} />
          </Grid>
        )) }
      </Grid>

      { trainees?.length ? (
        <>
          <Typography variant="h4" style={{ marginBottom: theme.spacing(2), marginTop: theme.spacing(4) }}>Trainees</Typography>

          <Grid container spacing={2}>
            { trainees.map((staff) => (
              <Grid item xs={12} sm={6} key={`trainees_${staff.id}`}>
                <Staff details={staff} />
              </Grid>
            )) }
          </Grid>
        </>
      ) : null }

      <Hidden mdUp>
        <Typography variant="h4" style={{ marginBottom: theme.spacing(4), marginTop: theme.spacing(8) }}>Contact Us</Typography>
        <Grid container>
          <Grid item xs={12} sm={8}>
            <Grid container direction="column" spacing={2} style={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white' }}>
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
                      Atenews Office, Ground Floor, Arrupe Hall, Martin Building,
                      Ateneo de Davao University,E. Jacinto St.,
                      {' '}
                      <b>8016 Davao City, Philippines</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({ req, res });

  try {
    const staffs = await caller.staff();
    return {
      props: {
        staffs,
      },
    };
  } catch (err) {
    return {
      props: {
        staffs: [],
      },
    };
  }
};

export default StaffPage;
