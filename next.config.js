const withPWA = require('next-pwa');

module.exports = withPWA({
  webpack5: true,
  pwa: {
    dest: 'public',
    // importScripts: ['/firebase-messaging-sw.js'],
    disable: process.env.NODE_ENV === 'development',
    register: true,
  },
  images: {
    domains: ['wp.atenews.ph', 'atenews.ph'],
  },
});
