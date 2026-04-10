import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    domains: ['localhost', 'vercel.com'],
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: 'http://localhost:8081' },
        { key: 'Access-Control-Allow-Origin', value: 'https://app.thefurfinder.com' },
        { key: 'Access-Control-Allow-Origin', value: 'https://thefurfinder.com' },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value:
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
        },
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=10, stale-while-revalidate=59',
        },
      ],
    },
  ],
  redirects: async () => [],
  rewrites: async () => ({
    beforeFiles: [],
    afterFiles: [],
    fallback: [],
  }),
}

export default nextConfig
