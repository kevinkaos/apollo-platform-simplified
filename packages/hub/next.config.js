/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow iframe sources from module URLs
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' http://localhost:* https://*.app.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
