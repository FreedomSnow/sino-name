import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://sinoname.com'
    : 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/private/',
          '/admin/',
          '/*.json$',
          '/oauth-*',
          '/temp/',
          '/cache/',
          '/*?*utm_*',  // 屏蔽UTM参数页面
          '/*?*fbclid*', // 屏蔽Facebook点击ID
          '/*?*gclid*',  // 屏蔽Google点击ID
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/admin/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/admin/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/admin/'],
        crawlDelay: 2,
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        crawlDelay: 1,
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-pages.xml`,
      `${baseUrl}/sitemap-services.xml`
    ],
    host: baseUrl,
  }
}