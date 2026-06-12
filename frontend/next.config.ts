import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.lemanapro.ru',
      },
    ],
  },
};

export default nextConfig;
