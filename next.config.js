/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
      {
        source: '/sitemap-index.xml',
        destination: '/api/sitemap-index.xml',
      },
      {
        source: '/sitemap-static.xml',
        destination: '/api/sitemap-static.xml',
      },
      {
        source: '/sitemap-names.xml',
        destination: '/api/sitemap-names.xml',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots.txt',
      },
    ];
  },
};

module.exports = nextConfig;