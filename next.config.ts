import type { NextConfig } from "next";
// import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    // 在生产构建期间忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

// if (process.env.NODE_ENV === "development") {
//   await setupDevPlatform();
// }

export default nextConfig;
