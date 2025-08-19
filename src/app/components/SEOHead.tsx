import { Metadata } from 'next'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}

export function generateSEOMetadata({
  title = 'SinoName - 中文名字生成器',
  description = '专业的中文名字生成器，为外国人提供个性化中文起名服务',
  keywords = ['中文名字生成器', 'Chinese name generator'],
  canonical = 'https://sinoname.com',
  ogImage = '/og-image.png',
  noIndex = false
}: SEOHeadProps): Metadata {
  return {
    title,
    description,
    keywords,
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'SinoName',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}