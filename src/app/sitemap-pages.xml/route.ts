import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://sinoname.com'
    : 'http://localhost:3000'
    
  const currentDate = new Date().toISOString()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/?lang=zh"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="ja-JP" href="${baseUrl}/?lang=ja"/>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${baseUrl}/?lang=ko"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/"/>
  </url>
  <url>
    <loc>${baseUrl}/bespoke</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/bespoke?lang=zh"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/bespoke?lang=en"/>
    <xhtml:link rel="alternate" hreflang="ja-JP" href="${baseUrl}/bespoke?lang=ja"/>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${baseUrl}/bespoke?lang=ko"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/bespoke"/>
  </url>
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
    }
  })
}