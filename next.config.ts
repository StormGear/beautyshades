import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "specswura.com" },
      { protocol: "https", hostname: "www.specswura.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.neon.tech" },
    ],

  },
};

export default nextConfig;
