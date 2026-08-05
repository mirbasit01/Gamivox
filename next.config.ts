import type { NextConfig } from "next";

interface MyNextConfig extends NextConfig {
  turbopackFileSystemCacheForDev?: boolean;
}

const nextConfig: MyNextConfig = {
  reactStrictMode: true,
  turbopackFileSystemCacheForDev: true,
};

export default nextConfig;
