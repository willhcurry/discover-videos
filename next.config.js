/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY,
    NEXT_PUBLIC_HASURA_ADMIN_URL: process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
    NEXT_PUBLIC_HASURA_ADMIN_SECRET: process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
  }
};

// Use module.exports for CommonJS
module.exports = nextConfig;