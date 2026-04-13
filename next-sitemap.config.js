/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://saip.gov.sa',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'monthly',
  priority: 0.7,
  exclude: ['/404', '/500'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: ['https://saip.gov.sa/sitemap.xml'],
  },
};
