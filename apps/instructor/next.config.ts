import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@3de/ui', '@3de/apis', '@3de/interfaces', '@3de/auth'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cloudinary.com', 'res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@3de/apis'],
  },
}

export default nextConfig
