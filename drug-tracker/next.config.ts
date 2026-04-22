import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
    // Allow data URLs (base64) for local image previews
    dangerouslyAllowSVG: true,
  },
  // Reduce unnecessary re-renders in dev
  reactStrictMode: false,
};

export default nextConfig;
