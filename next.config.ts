import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dxknd9hpx/**',
      },
      {
        protocol: 'https',
        hostname: 'pagead2.googlesyndication.com',
      },
    ],
  },
}

export default nextConfig
