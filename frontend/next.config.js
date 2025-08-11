/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'www.luxeloom.com', 'www.urbanmarket.com', 'b2b.auracommerce.com', 'images.unsplash.com'],
  },
  async rewrites() {
    return [
      // Handle custom domains for different brands
      {
        source: '/:path*',
        destination: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.luxeloom.com',
          },
        ],
      },
      {
        source: '/:path*',
        destination: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.urbanmarket.com',
          },
        ],
      },
      {
        source: '/:path*',
        destination: '/:path*',
        has: [
          {
            type: 'host',
            value: 'b2b.auracommerce.com',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
