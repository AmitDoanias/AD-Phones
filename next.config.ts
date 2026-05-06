import type { NextConfig } from "next";

const previewOrigins =
  process.env.VERCEL_ENV === "preview"
    ? ([process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter(Boolean) as string[])
    : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "ad-phones.co.il", ...previewOrigins],
    },
  },
};

export default nextConfig;
