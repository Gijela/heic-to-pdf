/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 在生产构建期间忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 