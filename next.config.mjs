/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['covers.openlibrary.org', 'm.media-amazon.com'],
  },
}

export default nextConfig
