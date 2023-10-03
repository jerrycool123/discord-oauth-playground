if (process.env.NEXT_PUBLIC_APP_URL === undefined) {
  throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  headers() {
    return [
      {
        source: '/api/oauth-token',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
