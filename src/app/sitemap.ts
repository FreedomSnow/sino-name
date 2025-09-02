import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://sinoname.com'
    : 'http://localhost:3000'

  const currentDate = new Date()
  const lastModified = currentDate.toISOString()

  // 主要页面
  const mainPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1.0,
      alternates: {
        languages: {
          'zh-CN': `${baseUrl}?lang=zh`,
          'en-US': `${baseUrl}?lang=en`,
          'ja-JP': `${baseUrl}?lang=ja`,
          'ko-KR': `${baseUrl}?lang=ko`,
        }
      }
    },
    {
      url: `${baseUrl}/bespoke`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'zh-CN': `${baseUrl}/bespoke?lang=zh`,
          'en-US': `${baseUrl}/bespoke?lang=en`,
          'ja-JP': `${baseUrl}/bespoke?lang=ja`,
          'ko-KR': `${baseUrl}/bespoke?lang=ko`,
        }
      }
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/oauth-success`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }
  ]

  // 服务页面
  const servicePages = [
    {
      url: `${baseUrl}/services/name-generator`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/cultural-meaning`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/pronunciation-guide`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  ]

  // 资源页面
  const resourcePages = [
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    }
  ]

  return [...mainPages, ...servicePages, ...resourcePages]
}