import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from "./providers";
import WebVitals from './seo/WebVitals'
import ServiceWorkerRegister from './seo/ServiceWorkerRegister'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#036aff',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  title: {
    default: 'SinoName - 中文名字生成器 | 为外国人定制专属中文名',
    template: '%s | SinoName - 中文名字生成器'
  },
  description: '专业的中文名字生成器，为外国人、留学生、外企员工提供个性化中文起名服务。基于传统文化和现代需求，生成寓意美好的中文名字。支持定制服务、生辰八字、姓氏选择等多种起名方式。',
  keywords: [
    '中文名字生成器', 'Chinese name generator', '外国人中文名', 'Chinese names for foreigners',
    '英文名转中文名', 'English to Chinese name', '起中文名字', 'Chinese naming service',
    '中文姓名定制', 'Custom Chinese names', '生辰八字起名', 'Ba Zi naming',
    '传统起名', 'Traditional Chinese naming', '个性化起名', 'Personalized naming',
    '外国人取名服务', 'Naming service for expats', 'SinoName'
  ],
  authors: [{ name: 'SinoName Team', url: 'https://sinoname.com' }],
  creator: 'SinoName',
  publisher: 'SinoName',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sinoname.com'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/?lang=zh',
      'en-US': '/?lang=en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    url: 'https://sinoname.com',
    title: 'SinoName - 中文名字生成器 | Chinese Name Generator',
    description: '专业的中文名字生成器，为外国人提供个性化中文起名服务。Professional Chinese name generator for foreigners.',
    siteName: 'SinoName',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SinoName 中文名字生成器 - Chinese Name Generator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SinoName',
    creator: '@SinoName',
    title: 'SinoName - 中文名字生成器 | Chinese Name Generator',
    description: '专业的中文名字生成器，为外国人提供个性化中文起名服务',
    images: {
      url: '/og-image.png',
      alt: 'SinoName 中文名字生成器',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#036aff',
      },
    ],
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  category: 'technology',
  classification: 'Business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预加载关键资源 */}
        <link rel="preload" href="/icon.png" as="image" type="image/png" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "@id": "https://sinoname.com/#webapp",
                  "name": "SinoName 中文名字生成器",
                  "alternateName": "SinoName Chinese Name Generator",
                  "description": "专业的中文名字生成器，为外国人提供个性化中文起名服务",
                  "url": "https://sinoname.com/",
                  "applicationCategory": ["UtilityApplication", "EducationalApplication"],
                  "operatingSystem": "All",
                  "browserRequirements": "Requires JavaScript. Requires HTML5.",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "CNY",
                    "availability": "https://schema.org/InStock"
                  },
                  "provider": {
                    "@type": "Organization",
                    "@id": "https://sinoname.com/#organization"
                  },
                  "featureList": [
                    "个性化中文名字生成",
                    "传统文化结合现代需求", 
                    "多种起名方式选择",
                    "生辰八字起名",
                    "姓氏定制服务",
                    "发音指导",
                    "多语言支持"
                  ],
                  "inLanguage": ["zh-CN", "en-US"],
                  "screenshot": [
                    {
                      "@type": "ImageObject",
                      "url": "https://sinoname.com/screenshot-wide.png",
                      "width": 1280,
                      "height": 720
                    }
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://sinoname.com/#organization",
                  "name": "SinoName",
                  "url": "https://sinoname.com/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://sinoname.com/icon.png",
                    "width": 192,
                    "height": 192
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "availableLanguage": ["Chinese", "English"],
                    "url": "https://sinoname.com/contact-us"
                  },
                  "foundingDate": "2024",
                  "description": "专业的中文命名服务提供商",
                  "serviceArea": {
                    "@type": "Place",
                    "name": "Worldwide"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://sinoname.com/#website",
                  "url": "https://sinoname.com/",
                  "name": "SinoName",
                  "description": "专业的中文名字生成器平台",
                  "publisher": {
                    "@id": "https://sinoname.com/#organization"
                  },
                  "inLanguage": ["zh-CN", "en-US"],
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint", 
                        "urlTemplate": "https://sinoname.com/?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ]
                },
                {
                  "@type": "Service",
                  "@id": "https://sinoname.com/#service",
                  "name": "中文名字定制服务",
                  "alternateName": "Chinese Name Customization Service",
                  "provider": {
                    "@id": "https://sinoname.com/#organization"
                  },
                  "serviceType": "Naming Service",
                  "description": "为外国人提供个性化的中文名字定制服务",
                  "areaServed": {
                    "@type": "Place",
                    "name": "Worldwide"
                  },
                  "availableLanguage": ["zh-CN", "en-US"],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "命名服务目录",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "个性化中文名字生成",
                          "description": "基于个人特征生成中文名字"
                        },
                        "price": "0",
                        "priceCurrency": "CNY"
                      },
                      {
                        "@type": "Offer", 
                        "itemOffered": {
                          "@type": "Service",
                          "name": "生辰八字起名",
                          "description": "根据传统生辰八字理论起名"
                        },
                        "price": "0",
                        "priceCurrency": "CNY"
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "姓氏定制服务",
                          "description": "提供多种中文姓氏选择"
                        },
                        "price": "0",
                        "priceCurrency": "CNY"
                      }
                    ]
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://sinoname.com/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "SinoName如何为外国人生成中文名字？",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "SinoName结合传统中文命名文化和现代需求，通过AI算法为外国人生成既有文化内涵又易于理解的中文名字。"
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "生成的中文名字是否有特殊含义？",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "是的，每个生成的中文名字都有积极的寓意，结合了传统文化中对美好品德和未来祝愿的表达。"
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <WebVitals />
        <ServiceWorkerRegister />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
