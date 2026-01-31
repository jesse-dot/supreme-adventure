/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  // Disable static optimization to avoid Clerk validation during build
  output: 'standalone',
}

module.exports = nextConfig
