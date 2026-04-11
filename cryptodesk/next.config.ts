import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@mastra/core", "mastra"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "better-sqlite3"];
    }
    return config;
  },
};

export default nextConfig;
