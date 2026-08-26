import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: []
  },
  poweredByHeader: false
};

export default nextConfig;
