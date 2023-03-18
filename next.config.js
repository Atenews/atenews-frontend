const withPWA = require('next-pwa')({
  dest: 'public',
  // importScripts: ['/firebase-messaging-sw.js'],
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
});
