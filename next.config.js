/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/", destination: "/index.html" }];
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
