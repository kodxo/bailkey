import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Local dev Cloudflare R2
      {
        protocol: "https",
        hostname: "pub-7efc56cc23124e31b5ada273dd9a17fe.r2.dev",
      },
    ],
  },
};

export default nextConfig;
