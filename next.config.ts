import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/signup',
        permanent: true,
      },

      {
        source: '/resources',
        destination: '/',
        permanent: false,
      },
      {
        source: '/demo',
        destination: '/#demo',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
