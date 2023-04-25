/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zbjqqzpujmtnfcrchymi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      }
    ]
  }
}

module.exports = nextConfig
