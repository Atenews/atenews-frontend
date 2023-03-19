import React from 'react';

import { useTheme } from '@mui/material/styles';

import { format } from 'date-fns';

import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';

interface Props {
  page: {
    title: string;
    content: string;
    date: string;
  };
}

const CustomPage: React.FC<Props> = ({ page }) => {
  const theme = useTheme();

  return (
    <div>
      <Hidden mdDown>
        <Typography variant="h3" component="h1" dangerouslySetInnerHTML={{ __html: page.title }} />
      </Hidden>
      <Hidden mdUp>
        <Typography variant="h4" component="h1" dangerouslySetInnerHTML={{ __html: page.title }} />
      </Hidden>
      <Typography variant="body2" style={{ marginTop: theme.spacing(1) }}>{format(new Date(page.date), 'MMMM d, yyyy')}</Typography>
      <Typography
        variant="body1"
        component="div"
        style={{
          marginTop: theme.spacing(2),
          lineHeight: '1.9em',
          width: '100%',
          color: theme.palette.text.primary,
        }}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
};

export default CustomPage;
