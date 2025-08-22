/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static HTML file serving for ACUL pages
  async rewrites() {
    return [
      // Serve ACUL pages from public directory
      {
        source: '/login',
        destination: '/login.html',
      },
      {
        source: '/callback',
        destination: '/callback.html',
      },
      {
        source: '/logout',
        destination: '/logout.html',
      },
      // Debug pages
      {
        source: '/login-debug-404',
        destination: '/login-debug-404.html',
      },
      {
        source: '/login-debug',
        destination: '/login-debug.html',
      },
      {
        source: '/test-auth0-domain',
        destination: '/test-auth0-domain.html',
      },
      {
        source: '/cdn-test',
        destination: '/cdn-test.html',
      },
      {
        source: '/test-local-sdk',
        destination: '/test-local-sdk.html',
      },
      {
        source: '/debug-main',
        destination: '/debug-main.html',
      },
      {
        source: '/debug-signin',
        destination: '/debug-signin.html',
      },
      {
        source: '/test-auth-provider',
        destination: '/test-auth-provider.html',
      },
      {
        source: '/auth-flow-test',
        destination: '/auth-flow-test.html',
      },
      {
        source: '/clear-auth',
        destination: '/clear-auth.html',
      },
      {
        source: '/debug-errors',
        destination: '/debug-errors.html',
      },
      {
        source: '/test-signin',
        destination: '/test-signin.html',
      },
      {
        source: '/debug-signin-button',
        destination: '/debug-signin-button.html',
      },
      {
        source: '/simple-test',
        destination: '/simple-test.html',
      },
      {
        source: '/working-auth',
        destination: '/working-auth.html',
      },
      {
        source: '/test-auth0-flow',
        destination: '/test-auth0-flow.html',
      },
      {
        source: '/direct-auth0-test',
        destination: '/direct-auth0-test.html',
      },
      {
        source: '/simple-test-button',
        destination: '/simple-test-button.html',
      },
      {
        source: '/force-auth0-test',
        destination: '/force-auth0-test.html',
      },
      {
        source: '/test-auth0-url',
        destination: '/test-auth0-url.html',
      },
      {
        source: '/test-external-redirect',
        destination: '/test-external-redirect.html',
      },
    ];
  },

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Security headers for authentication pages
        source: '/(login|callback|logout).html',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.auth0.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.auth0.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },

  // Image optimization
  images: {
    domains: ['localhost', 'www.luxeloom.com', 'www.urbanmarket.com', 'b2b.auracommerce.com'],
  },

  // Webpack configuration for Auth0 SDK
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configure webpack for client-side Auth0 SDK
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Redirects for better UX
  async redirects() {
    return [
      // Redirect /auth/callback to /callback for consistency
      {
        source: '/auth/callback',
        destination: '/callback',
        permanent: true,
      },
      // Redirect /signin to /login
      {
        source: '/signin',
        destination: '/login',
        permanent: true,
      },
      // Redirect /signout to /logout
      {
        source: '/signout',
        destination: '/logout',
        permanent: true,
      },
    ];
  },

  // Output configuration
  output: 'standalone',

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,
};

module.exports = nextConfig;
