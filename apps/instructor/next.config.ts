import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/ins',
  assetPrefix: '/ins/',
  trailingSlash: true,
  output: 'standalone',
  transpilePackages: ['@3de/ui', '@3de/apis', '@3de/interfaces', '@3de/auth'],
  experimental: {
    optimizePackageImports: ['@3de/ui', 'lucide-react'],
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  allowedDevOrigins: ['https://3de.school'],
  images: {
    domains: ['localhost', '3de.school'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: https://3de.school https://cloudinary.com; " +
              "media-src 'self' blob: https://3de.school https://cloudinary.com;  " +
              "connect-src 'self' blob: https://3de.school https://www.3de.school https://cloudinary.com https://api.3de.school;"
          },
        ],
      },
    ];
  },
};

export default nextConfig;
