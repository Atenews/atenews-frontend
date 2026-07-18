import React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

type HiddenProps = {
  children: React.ReactNode;
  smUp?: boolean;
  smDown?: boolean;
  mdUp?: boolean;
  mdDown?: boolean;
  lgUp?: boolean;
  lgDown?: boolean;
  xlUp?: boolean;
  xlDown?: boolean;
};

function getDisplayMap(
  rest: Omit<HiddenProps, 'children'>,
): Record<string, string> | undefined {
  if (rest.mdDown) {
    return {
      xs: 'none',
      sm: 'none',
      md: 'none',
      lg: 'contents',
      xl: 'contents',
    };
  }
  if (rest.mdUp) {
    return {
      xs: 'contents',
      sm: 'contents',
      md: 'none',
      lg: 'none',
      xl: 'none',
    };
  }
  if (rest.smDown) {
    return {
      xs: 'none',
      sm: 'contents',
      md: 'contents',
      lg: 'contents',
      xl: 'contents',
    };
  }
  if (rest.smUp) {
    return { xs: 'contents', sm: 'none', md: 'none', lg: 'none', xl: 'none' };
  }
  if (rest.lgDown) {
    return { xs: 'none', sm: 'none', md: 'none', lg: 'contents', xl: 'none' };
  }
  if (rest.lgUp) {
    return {
      xs: 'contents',
      sm: 'contents',
      md: 'contents',
      lg: 'none',
      xl: 'none',
    };
  }
  if (rest.xlDown) {
    return { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'contents' };
  }
  if (rest.xlUp) {
    return {
      xs: 'contents',
      sm: 'contents',
      md: 'contents',
      lg: 'contents',
      xl: 'none',
    };
  }
  return undefined;
}

export default function Hidden(props: HiddenProps) {
  const { children, ...rest } = props;
  const displayMap = getDisplayMap(rest);

  if (!displayMap) {
    return <>{children}</>;
  }

  return <Box sx={{ display: displayMap }}>{children}</Box>;
}
