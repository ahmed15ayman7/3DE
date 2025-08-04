import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/public',
  assetPrefix: '/public/',
  trailingSlash: true,
  output: 'standalone',
  transpilePackages: ['@3de/ui', '@3de/apis', '@3de/interfaces', '@3de/auth'],
  experimental: {
    optimizePackageImports: ['@3de/ui', 'lucide-react'],
  },
  allowedDevOrigins: ['https://iafce.net'],
  images: {
    domains: ['localhost', 'iafce.net', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
