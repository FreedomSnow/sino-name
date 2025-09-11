'use client'

import { useEffect } from 'react'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  timestamp: number
  url: string
}

interface WebVitalsMetric {
  name: string
  value: number
  delta: number
  id: string
}

/**
 * 根据 Google 标准评估性能指标
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
    case 'FID':
    case 'INP':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
    default:
      return 'needs-improvement'
  }
}

/**
 * 将性能指标存储到本地存储
 */
function storeMetric(metric: PerformanceMetric): void {
  try {
    // 存储到 localStorage 用于分析
    const key = `web-vitals-${metric.name}`
    const existing = localStorage.getItem(key)
    const metrics = existing ? JSON.parse(existing) : []
    
    // 只保留最近 10 条记录
    metrics.push(metric)
    if (metrics.length > 10) {
      metrics.shift()
    }
    
    localStorage.setItem(key, JSON.stringify(metrics))
  } catch {
    // 静默失败，不影响用户体验
  }
}

/**
 * 发送性能指标到分析系统
 */
function sendToAnalytics(metric: PerformanceMetric): void {
  // 存储到本地
  storeMetric(metric)
  
  // 发送到Google Analytics（如果配置了）
  if (typeof window !== 'undefined' && 'gtag' in window) {
    interface GtagWindow extends Window {
      gtag: (command: string, targetId: string, parameters?: Record<string, unknown>) => void
    }
    (window as GtagWindow).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: { metric_rating: metric.rating }
    })
  }

  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WebVitals] ${metric.name}: ${metric.value}ms (${metric.rating})`)
    
    // 显示性能建议
    if (metric.rating === 'poor') {
      console.warn(`⚠️ ${metric.name} 性能较差，建议优化`)
    } else if (metric.rating === 'needs-improvement') {
      console.info(`ℹ️ ${metric.name} 性能一般，可考虑优化`)
    }
  }
}

/**
 * Web Vitals 性能监控组件
 * 收集并报告 Core Web Vitals 指标
 */
export default function OptimizedWebVitals(): null {
  useEffect(() => {
    // 服务器端不执行
    if (typeof window === 'undefined') return
    
    // 避免重复监听
    let isSetup = false
    
    // 设置监听器
    const setupMetrics = () => {
      if (isSetup) return
      isSetup = true

      // 动态导入Web Vitals（按需加载）
      import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        const reportMetric = (metric: WebVitalsMetric) => {
          const standardMetric: PerformanceMetric = {
            name: metric.name,
            value: metric.value,
            rating: getRating(metric.name, metric.value),
            delta: metric.delta,
            id: metric.id,
            timestamp: Date.now(),
            url: window.location.href
          }
          sendToAnalytics(standardMetric)
        }

        // 注册所有 Core Web Vitals
        onCLS(reportMetric)
        onFCP(reportMetric)
        onINP(reportMetric)
        onLCP(reportMetric)
        onTTFB(reportMetric)
      }).catch(() => {
        // 降级方案：使用原生 PerformanceObserver
        if ('PerformanceObserver' in window) {
          // LCP监控
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            if (lastEntry) {
              sendToAnalytics({
                name: 'LCP',
                value: lastEntry.startTime,
                rating: getRating('LCP', lastEntry.startTime),
                delta: lastEntry.startTime,
                id: `${Date.now()}-${Math.random()}`,
                timestamp: Date.now(),
                url: window.location.href
              })
            }
          })

          try {
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
          } catch {
            // 静默失败，不影响用户体验
          }
        }
      })
    }
    
    // 在页面加载完成后延迟执行，避免与关键渲染竞争
    if (document.readyState === 'complete') {
      // 页面已加载，立即设置
      setupMetrics();
    } else {
      // 等待页面加载完成
      window.addEventListener('load', setupMetrics);
      // 清理函数
      return () => window.removeEventListener('load', setupMetrics);
    }
  }, [])

  return null
}
