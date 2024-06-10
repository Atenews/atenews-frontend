const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

module.exports = withPWA({
  images: {
    domains: ['wp.atenews.ph', 'atenews.ph'],
  },
  compiler: {
    styledComponents: true,
  },
  compress: false,
  swcMinify: true,
  reactStrictMode: true,
  output: 'standalone',
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
  },
});
