import { Metadata } from 'next'
import { ReactElement } from 'react'

interface PageSEOProps {
    title: string
    description: string
    path?: string
    keywords?: string[]
    noIndex?: boolean
}

export function generatePageMetadata({
    title,
    description,
    path = '',
    keywords = [],
    noIndex = false
}: PageSEOProps): Metadata {
    const fullTitle = title.includes('SinoName') ? title : `${title} | SinoName - 中文名字生成器`
    const canonicalUrl = `https://sinoname.com${path}`

    return {
        title: fullTitle,
        description,
        keywords: [
            ...keywords,
            '中文名字生成器', 'Chinese name generator', '外国人中文名', 'SinoName'
        ],
        robots: {
            index: !noIndex,
            follow: !noIndex,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'zh-CN': `${canonicalUrl}?lang=zh`,
                'en-US': `${canonicalUrl}?lang=en`,
            },
        },
        openGraph: {
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName: 'SinoName',
            images: [
                {
                    url: '/og-image.png',
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
            title: fullTitle,
            description,
            images: ['/og-image.png'],
        },
    }
}

// 定义结构化数据的类型
interface StructuredDataBase {
    "@context": string
    "@type": string
    "@id": string
    url: string
    name: string
    isPartOf: {
        "@id": string
    }
    about: {
        "@id": string
    }
    datePublished: string
    dateModified: string
    description: string
    inLanguage: string
}

interface AdditionalStructuredData {
    [key: string]: unknown
}

type StructuredData = StructuredDataBase & AdditionalStructuredData

// 页面级别结构化数据生成器
export function generatePageStructuredData(
    page: string,
    additionalData?: AdditionalStructuredData
): ReactElement {
    const baseData: StructuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `https://sinoname.com/${page}#webpage`,
        "url": `https://sinoname.com/${page}`,
        "name": `SinoName - ${page}`,
        "isPartOf": {
            "@id": "https://sinoname.com/#website"
        },
        "about": {
            "@id": "https://sinoname.com/#organization"
        },
        "datePublished": "2024-01-01T00:00:00+08:00",
        "dateModified": new Date().toISOString(),
        "description": "SinoName专业中文命名服务页面",
        "inLanguage": "zh-CN",
        ...(additionalData || {})
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
        />
    )
}

// 预定义的结构化数据模板
export const structuredDataTemplates = {
    // 服务页面模板
    service: (serviceName: string, description: string) => ({
        "@type": "Service",
        "name": serviceName,
        "description": description,
        "provider": {
            "@id": "https://sinoname.com/#organization"
        },
        "serviceType": "Naming Service",
        "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
        }
    }),

    // FAQ页面模板
    faq: (questions: Array<{question: string, answer: string}>) => ({
        "@type": "FAQPage",
        "mainEntity": questions.map(qa => ({
            "@type": "Question",
            "name": qa.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": qa.answer
            }
        }))
    }),

    // 文章页面模板
    article: (title: string, description: string, publishDate: string) => ({
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Organization",
            "@id": "https://sinoname.com/#organization"
        },
        "publisher": {
            "@type": "Organization",
            "@id": "https://sinoname.com/#organization"
        },
        "datePublished": publishDate,
        "dateModified": new Date().toISOString(),
        "image": "https://sinoname.com/og-image.png"
    })
}

// 生成特定类型的结构化数据
export function generateServiceStructuredData(
    serviceName: string,
    description: string,
    path: string
): ReactElement {
    return generatePageStructuredData(
        path,
        structuredDataTemplates.service(serviceName, description)
    )
}

export function generateFAQStructuredData(
    questions: Array<{question: string, answer: string}>,
    path: string
): ReactElement {
    return generatePageStructuredData(
        path,
        structuredDataTemplates.faq(questions)
    )
}

export function generateArticleStructuredData(
    title: string,
    description: string,
    publishDate: string,
    path: string
): ReactElement {
    return generatePageStructuredData(
        path,
        structuredDataTemplates.article(title, description, publishDate)
    )
}
