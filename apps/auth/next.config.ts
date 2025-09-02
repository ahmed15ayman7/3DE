import type { NextConfig } from "next";
import {createSecureHeaders} from 'next-secure-headers';

const nextConfig: NextConfig = {
  assetPrefix: '/auth/',
  basePath: '/auth',
  trailingSlash: true,
  output: 'standalone',
  transpilePackages: ['@3de/ui', '@3de/apis', '@3de/interfaces', '@3de/auth'],
  experimental: {
    optimizePackageImports: ['@3de/ui', 'lucide-react'],
  },
  images: {
    domains: ['localhost', '3de.school'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.3de.school',
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-3de-school-2024',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-jwt-key-for-3de-school-2024',
    NEXT_PUBLIC_COOKIE_DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
    NEXT_PUBLIC_COOKIE_SECURE: process.env.NEXT_PUBLIC_COOKIE_SECURE || 'false',
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
                imgSrc: ["'self'", "data:"],
                connectSrc: [
                  "'self'",
                  "http://localhost:3002",
                  "https://3de.school",
                  "https://api.3de.school",
                ],                
              },
            },
          }),
        ],
      },
    ];
  },
};

export default nextConfig;
