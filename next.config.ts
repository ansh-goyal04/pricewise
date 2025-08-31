import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
   serverActions: {
    bodySizeLimit: "2mb",
    allowedOrigins: ["http://localhost:3000"], 
  },
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["m.media-amazon.com"], 
  },
};

export default nextConfig;
