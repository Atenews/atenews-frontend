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

export default function Hidden(props: HiddenProps) {
  const { children, ...rest } = props;

  if (rest.mdDown) {
    return (
      <Box
        sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
      >
        {children}
      </Box>
    );
  }
  if (rest.mdUp) {
    return (
      <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
        {children}
      </Box>
    );
  }
  if (rest.smDown) {
    return <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{children}</Box>;
  }
  if (rest.smUp) {
    return <Box sx={{ display: { xs: 'block', sm: 'none' } }}>{children}</Box>;
  }
  if (rest.lgDown) {
    return (
      <Box sx={{ display: { xs: 'none', sm: 'none', lg: 'block' } }}>
        {children}
      </Box>
    );
  }
  if (rest.lgUp) {
    return (
      <Box
        sx={{ display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' } }}
      >
        {children}
      </Box>
    );
  }
  if (rest.xlDown) {
    return (
      <Box
        sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'none',
            lg: 'none',
            xl: 'block',
          },
        }}
      >
        {children}
      </Box>
    );
  }
  if (rest.xlUp) {
    return (
      <Box
        sx={{
          display: {
            xs: 'block',
            sm: 'block',
            md: 'block',
            lg: 'block',
            xl: 'none',
          },
        }}
      >
        {children}
      </Box>
    );
  }

  return <>{children}</>;
}
