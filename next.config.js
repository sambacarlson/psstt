const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-mainfest.json$/],
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});
module.exports = nextConfig;
