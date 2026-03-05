/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['melodiarara.com', 'melodiarara.vercel.app'],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Upstash-Signature' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.mercadopago.com https://*.mlstatic.com https://*.mercadolibre.com https://*.mercadolibre.com.ar https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.mlstatic.com https://*.mercadopago.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com https://*.mlstatic.com",
              "connect-src 'self' https://api.openai.com https://cdn1.suno.ai https://vitals.vercel-insights.com https://*.mercadopago.com https://*.mlstatic.com https://*.mercadolibre.com https://www.facebook.com https://*.facebook.com https://*.facebook.net https://*.birchub.events https://*.awsapprunner.com https://qstash.upstash.io",
              "frame-src 'self' https://*.mercadopago.com https://*.mlstatic.com https://*.mercadolibre.com",
              "media-src 'self' https://cdn1.suno.ai blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://*.mercadopago.com",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
