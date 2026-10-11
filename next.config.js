/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      {
        source: "/tools/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
