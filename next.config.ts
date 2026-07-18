import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.atenews.ph',
      },
      {
        protocol: 'https',
        hostname: 'atenews.ph',
      },
    ],
  },
  compress: false,
  reactStrictMode: true,
  output: 'standalone',
};

export default nextConfig;
