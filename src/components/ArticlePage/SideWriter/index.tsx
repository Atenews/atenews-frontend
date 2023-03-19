import React from 'react';
import { useTheme } from '@mui/material/styles';

import Tag from '@/components/General/Tag';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Hidden from '@mui/material/Hidden';

import IndividualWriter from '@/components/ArticlePage/SideWriter/IndividualWriter';

import { useSpring, animated } from 'react-spring';

interface Props {
  authors: Author[];
  tags: Category[];
  show: boolean;
}

const SideWriter: React.FC<Props> = ({
  authors, tags, show,
}) => {
  const theme = useTheme();

  const [props, api] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
    }),
    [],
  );

  React.useEffect(() => {
    api.start({ opacity: show ? 1 : 0 });
  }, [show]);

  return (
    <animated.div style={props}>
      <Hidden mdDown>
        <List>
          <Typography>Written by:</Typography>
          { authors.map((author, i) => (
            <IndividualWriter key={`sideauthor${i}`} author={author} />
          )) }
          <Divider style={{ marginBottom: theme.spacing(1), marginTop: theme.spacing(1) }} />
          <Typography style={{ marginBottom: theme.spacing(1) }}>Tags:</Typography>
          <Grid container spacing={1}>
            {
              tags.map((tag, i) => (
                <Grid item key={i}>
                  <Tag clickable type={tag} />
                </Grid>
              ))
            }
          </Grid>
        </List>
      </Hidden>
    </animated.div>
  );
};

export default SideWriter;
