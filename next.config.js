// next.config.js

const withPWA = require("next-pwa")({
  dest: "public", // where the service worker is generated
  disable: process.env.NEXT_PUBLIC_DEV_ENVIROMENT === "development", // disable PWA in development mode
});

module.exports = withPWA({
  // Additional Next.js config options here
});
