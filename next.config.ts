import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化配置
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif'], // 优化图片格式
  },
  
  // 压缩配置
  compress: true, // 启用 Gzip 压缩
  
  // 性能优化
  poweredByHeader: false, // 移除 X-Powered-By 头
  
  // 构建优化
  
  // 缓存优化
  onDemandEntries: {
    // 页面保持在内存中的时间（开发模式）
    maxInactiveAge: 60 * 1000,
    // 同时保持在内存中的页面数量
    pagesBufferLength: 5,
  },
  
  // 静态资源优化
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // 安全和性能头部
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // 实验性功能
  experimental: {
    optimizeCss: true, // CSS 优化
    scrollRestoration: true, // 滚动恢复
  },
};

export default nextConfig;
