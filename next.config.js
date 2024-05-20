/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
      {
        hostname: "cdn.casbin.org",
      },
    ],
  },
};

module.exports = nextConfig;
