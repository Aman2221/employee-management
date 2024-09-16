/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://primasoft.netlify.app", // Replace with your domain
  generateRobotsTxt: true, // (optional) Generates robots.txt
  sitemapSize: 7000, // Limits the number of URLs per sitemap file
  changefreq: "daily", // How often the pages are likely to change
  priority: 0.7, // The priority of the pages in the sitemap
  exclude: ["/404", "/admin/*"], // Exclude specific pages
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin" }, // Disallow admin section
    ],
  },
};
