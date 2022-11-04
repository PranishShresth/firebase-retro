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

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
});

module.exports = withPWA(nextConfig);
