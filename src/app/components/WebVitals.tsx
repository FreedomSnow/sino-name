'use client'

import { useEffect } from 'react'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

interface WebVitalsMetric {
  name: string
  value: number
  delta: number
  id: string
}

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

function sendToAnalytics(metric: PerformanceMetric): void {
  // 发送到Google Analytics
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

  // 发送到内部API
  const body = JSON.stringify({
    ...metric,
    url: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  })

  if ('sendBeacon' in navigator) {
    navigator.sendBeacon('/api/web-vitals', body)
  } else {
    fetch('/api/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    }).catch(() => { })
  }

  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WebVitals] ${metric.name}: ${metric.value} (${metric.rating})`)
  }
}

export default function OptimizedWebVitals(): null {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 动态导入Web Vitals
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      const reportMetric = (metric: WebVitalsMetric) => {
        const standardMetric: PerformanceMetric = {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          delta: metric.delta,
          id: metric.id
        }
        sendToAnalytics(standardMetric)
      }

      onCLS(reportMetric)
      onFCP(reportMetric)
      onINP(reportMetric)
      onLCP(reportMetric)
      onTTFB(reportMetric)
    }).catch(() => {
      // Web vitals加载失败时使用原生Performance API
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
              id: `${Date.now()}-${Math.random()}`
            })
          }
        })

        try {
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
        } catch (e) { }
      }
    })
  }, [])

  return null
}