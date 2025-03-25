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
  env: {
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  },
});
