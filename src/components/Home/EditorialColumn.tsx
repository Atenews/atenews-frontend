import React from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Title from '@/components/Home/Title';

const Article = dynamic(import('@/components/List/Article'));
const Column = dynamic(import('@/components/List/Column'));

const useStyles = makeStyles(() => ({
  section: {
    marginTop: 80,
  },
}));

export default function EditorialColumn({ editorial, columns }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.section}>
      <Title color={theme.palette.atenews.highlight}>Opinion</Title>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h4"
            style={{
              fontFamily: 'Open Sans', fontWeight: 400, letterSpacing: 5, marginBottom: theme.spacing(4),
            }}
          >
            Editorial
          </Typography>
          <Article article={editorial} topImage />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h4"
            style={{
              fontFamily: 'Open Sans', fontWeight: 400, letterSpacing: 5, marginBottom: theme.spacing(4),
            }}
          >
            Columns
          </Typography>
          {
              columns.map((column) => (
                <Column article={column} key={column.databaseId} />
              ))
            }
        </Grid>
      </Grid>
    </div>
  );
}
