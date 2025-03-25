// next.config.js

// const withPWA = require("next-pwa")({
//   dest: "public", // where the service worker is generated
//   disable: process.env.NEXT_PUBLIC_DEV_ENVIRONMENT === "development", // disable PWA in development mode
// });

// module.exports = withPWA({
//   // Additional Next.js config options here
//   images: {
//     domains: ["res.cloudinary.com"],
//   },
// });

/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NEXT_PUBLIC_DEV_ENVIRONMENT === "development",
});

module.exports = withPWA({
  // Additional Next.js config options here
  images: {
    domains: ["res.cloudinary.com"],
  },
});
