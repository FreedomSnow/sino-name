import { ReactElement } from 'react'

interface Organization {
  "@context": string
  "@type": string
  "@id": string
  name: string
  url: string
  logo: string
  description: string
  foundingDate: string
  contactPoint: {
    "@type": string
    telephone: string
    contactType: string
    availableLanguage: string[]
  }
  sameAs: string[]
  address: {
    "@type": string
    addressCountry: string
    addressRegion: string
  }
}

interface WebSite {
  "@context": string
  "@type": string
  "@id": string
  url: string
  name: string
  description: string
  publisher: {
    "@id": string
  }
  potentialAction: {
    "@type": string
    target: {
      "@type": string
      urlTemplate: string
    }
    "query-input": string
  }
  inLanguage: string[]
}

interface Service {
  "@context": string
  "@type": string
  name: string
  description: string
  provider: {
    "@id": string
  }
  serviceType: string
  areaServed: string
  availableChannel: {
    "@type": string
    serviceUrl: string
    serviceName: string
    availableLanguage: string[]
  }
  offers: {
    "@type": string
    priceCurrency: string
    price: string
    priceValidUntil: string
    availability: string
    validFrom: string
  }[]
}

// 组织信息结构化数据
export function OrganizationStructuredData(): ReactElement {
  const organizationData: Organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://sinoname.com/#organization",
    "name": "SinoName",
    "url": "https://sinoname.com",
    "logo": "https://sinoname.com/icon-512.png",
    "description": "专为外国人提供个性化中文起名服务的专业平台，结合传统文化与现代需求，打造独特的中文名字。",
    "foundingDate": "2024-01-01",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+86-400-123-4567",
      "contactType": "customer service",
      "availableLanguage": ["Chinese", "English", "Japanese", "Korean"]
    },
    "sameAs": [
      "https://twitter.com/sinoname",
      "https://facebook.com/sinoname",
      "https://linkedin.com/company/sinoname"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CN",
      "addressRegion": "Beijing"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  )
}

// 网站结构化数据
export function WebSiteStructuredData(): ReactElement {
  const websiteData: WebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sinoname.com/#website",
    "url": "https://sinoname.com",
    "name": "SinoName - 中文名字生成器",
    "description": "专业的中文命名平台，为外国人提供个性化起名服务",
    "publisher": {
      "@id": "https://sinoname.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sinoname.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["zh-CN", "en-US", "ja-JP", "ko-KR"]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  )
}

// 服务结构化数据
export function ServiceStructuredData(): ReactElement {
  const serviceData: Service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "中文起名服务",
    "description": "专业的中文命名服务，基于传统文化和现代需求为外国人起中文名",
    "provider": {
      "@id": "https://sinoname.com/#organization"
    },
    "serviceType": "命名服务",
    "areaServed": "全球",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://sinoname.com",
      "serviceName": "在线起名服务",
      "availableLanguage": ["zh-CN", "en-US", "ja-JP", "ko-KR"]
    },
    "offers": [
      {
        "@type": "Offer",
        "priceCurrency": "CNY",
        "price": "0",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      {
        "@type": "Offer",
        "priceCurrency": "CNY", 
        "price": "299",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
    />
  )
}

// FAQ结构化数据生成器
interface FAQItem {
  question: string
  answer: string
}

export function FAQStructuredData({ faqs }: { faqs: FAQItem[] }): ReactElement {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  )
}

// 综合结构化数据组件
export function CompleteStructuredData(): ReactElement {
  return (
    <>
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <ServiceStructuredData />
    </>
  )
}