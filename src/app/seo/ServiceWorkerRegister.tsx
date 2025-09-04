'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('Service Worker 注册成功:', registration.scope)

          // 处理更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 新版本可用，显示更新提示
                  if (confirm('🎉 网站有新版本可用，是否立即更新？\n更新后将获得更好的体验和性能优化。')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' })
                    window.location.reload()
                  }
                }
              })
            }
          })

          // 监听控制器变化
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload()
          })

          // 预缓存重要页面
          if (registration.active) {
            registration.active.postMessage({
              type: 'CACHE_URLS',
              payload: {
                urls: [
                  '/',
                  '/oauth-success',
                  '/oauth-error'
                ]
              }
            })
          }

        } catch (error) {
          console.error('Service Worker 注册失败:', error)
        }
      }

      // 延迟注册以不影响初始加载性能
      setTimeout(registerSW, 1000)
    }
  }, [])

  return null
}
