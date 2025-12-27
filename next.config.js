/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Output standalone for optimized Docker builds
  output: 'standalone',

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Strict type checking during build
  typescript: {
    ignoreBuildErrors: false,
  },

  // Strict ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Image optimization
  images: {
    domains: [], // Add domains as needed
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
