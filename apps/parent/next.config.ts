import type { NextConfig } from "next";
import {createSecureHeaders} from 'next-secure-headers';

const nextConfig: NextConfig = {
  basePath: '/parent',
  assetPrefix: '/parent/',
  trailingSlash: true,
  output: 'standalone',
  transpilePackages: ['@3de/ui', '@3de/apis', '@3de/interfaces', '@3de/auth'],
  experimental: {
    optimizePackageImports: ['@3de/ui', 'lucide-react'],
  },
  allowedDevOrigins: ['https://3de.school'],
  images: {
    domains: ['localhost', '3de.school', 'res.cloudinary.com', 'images.unsplash.com'],
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
          // حماية XSS الأساسية
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // CSP
          ...createSecureHeaders({
            contentSecurityPolicy: {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:","res.cloudinary.com"],
                connectSrc: ["'self'"],
              },
            },
          }),
        ],
      },
    ];
  },
};

export default nextConfig;
