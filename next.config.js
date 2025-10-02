/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  compress: true,
  images: {
    domains: ['3de.school'],
  },
  output: 'standalone',
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
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
"img-src 'self' data: blob: https://3de.school https://cloudinary.com https://res.cloudinary.com; " +
"media-src 'self' blob: https://3de.school https://cloudinary.com; " +
"connect-src 'self' blob: https://3de.school https://www.3de.school https://cloudinary.com https://api.3de.school https://api.cloudinary.com;"

          },
        ],
      },
    ];
  },
};

module.exports = nextConfig 