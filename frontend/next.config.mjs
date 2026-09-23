/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Local Next.js only. On Vercel, vercel.json routes /api to the FastAPI service.
    // Never proxy to 127.0.0.1 in production — that is why recommendations/KMP break on deploy.
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return [];
    }
    const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
