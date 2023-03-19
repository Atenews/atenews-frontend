import React from 'react';

import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { useCategory } from '@/utils/hooks/useCategory';

const useStyles = makeStyles((theme) => ({
  tag: {
    width: 'max-content',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    height: 20,
    color: 'white',
    textAlign: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
}));

interface Props {
  type: Category;
  clickable?: boolean;
}

// TODO: test color on dark mode and light mode
const Tag: React.FC<Props> = ({ type, clickable }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [text, setText] = React.useState('');
  const [url, setURL] = React.useState('');
  const [color, setColor] = React.useState(theme.palette.atenews.news);

  const { categories } = useCategory();

  React.useEffect(() => {
    setColor(theme.palette.atenews.main);
    setText(type.name);
    setURL(`/category/${type.slug}`);
  }, [type]);

  React.useEffect(() => {
    const currentCategory = categories?.find((cat) => type.slug === cat.slug);
    if (currentCategory) {
      setText(currentCategory.name);
      setColor(currentCategory.description ?? '');
    }
  }, [categories]);

  return (
    <CardActionArea
      LinkComponent={clickable ? NextLink : 'div'}
      href={clickable ? url : ''}
      className={classes.tag}
      style={{ backgroundColor: color }}
    >
      <Typography variant="body2">{text}</Typography>
    </CardActionArea>
  );
};

export default Tag;
