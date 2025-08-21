const CACHE_NAME = 'sinoname-v1.0.0'
const STATIC_CACHE = 'static-v1.0.0'
const DYNAMIC_CACHE = 'dynamic-v1.0.0'
const API_CACHE = 'api-v1.0.0'

// 需要缓存的静态资源
const STATIC_FILES = [
  '/',
  '/favicon.ico',
  '/icon.png',
  '/apple-touch-icon.png',
  '/manifest.json',
  '/offline.html'
]

// 需要缓存的API端点
const API_ENDPOINTS = [
  '/api/surnames',
  '/api/characters'
]

// 安装事件
self.addEventListener('install', (event) => {
  console.log('[SW] 安装中...')
  event.waitUntil(
    Promise.all([
      // 缓存静态文件
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('[SW] 缓存静态文件')
          return cache.addAll(STATIC_FILES)
        }),
      // 预缓存重要API
      caches.open(API_CACHE)
        .then(cache => {
          console.log('[SW] 预缓存API')
          return Promise.all(
            API_ENDPOINTS.map(url => {
              return fetch(url)
                .then(response => response.ok ? cache.put(url, response) : null)
                .catch(err => console.log('[SW] API预缓存失败:', url, err))
            })
          )
        })
    ]).then(() => {
      console.log('[SW] 安装完成，跳过等待')
      return self.skipWaiting()
    })
  )
})

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('[SW] 激活中...')
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE
            )
            .map(cacheName => {
              console.log('[SW] 删除旧缓存:', cacheName)
              return caches.delete(cacheName)
            })
        )
      }),
      // 立即控制所有页面
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] 激活完成')
    })
  )
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const { url, method } = request

  // 跳过非 GET 请求
  if (method !== 'GET') return

  // 跳过 Chrome 扩展请求
  if (url.startsWith('chrome-extension://')) return

  // 跳过开发服务器热更新请求
  if (url.includes('/_next/webpack-hmr') || url.includes('__nextjs')) return

  event.respondWith(handleRequest(request))
})

async function handleRequest(request) {
  const { url } = request
  
  try {
    // API 请求策略：网络优先，缓存备用
    if (url.includes('/api/')) {
      return await handleAPIRequest(request)
    }
    
    // 静态资源策略：缓存优先
    if (isStaticAsset(url)) {
      return await handleStaticRequest(request)
    }
    
    // 页面请求策略：网络优先，缓存备用
    return await handlePageRequest(request)
    
  } catch (error) {
    console.error('[SW] 请求处理失败:', url, error)
    return await handleOfflineFallback(request)
  }
}

// API请求处理
async function handleAPIRequest(request) {
  try {
    // 先尝试网络请求
    const response = await fetch(request)
    
    if (response.ok) {
      // 缓存成功的API响应
      const cache = await caches.open(API_CACHE)
      cache.put(request, response.clone())
      return response
    }
    
    throw new Error(`API请求失败: ${response.status}`)
  } catch (error) {
    // 网络失败时返回缓存
    console.log('[SW] API网络请求失败，尝试缓存:', request.url)
    const cachedResponse = await caches.match(request, { cacheName: API_CACHE })
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 返回离线API响应
    return new Response(
      JSON.stringify({ 
        error: 'offline', 
        message: '网络不可用，请稍后重试' 
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// 静态资源处理
async function handleStaticRequest(request) {
  // 先检查缓存
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    // 后台更新缓存
    updateStaticCache(request)
    return cachedResponse
  }
  
  // 缓存未命中，从网络获取
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    // 网络失败，返回默认资源
    if (request.url.endsWith('.png') || request.url.endsWith('.jpg')) {
      return new Response('', { status: 404 })
    }
    throw error
  }
}

// 页面请求处理  
async function handlePageRequest(request) {
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      // 缓存页面
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
      return response
    }
    
    throw new Error(`页面请求失败: ${response.status}`)
  } catch (error) {
    // 尝试返回缓存的页面
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 返回离线页面
    const offlinePage = await caches.match('/offline.html')
    if (offlinePage) {
      return offlinePage
    }
    
    // 最后的fallback
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head><title>离线 - SinoName</title></head>
        <body>
          <h1>网络连接不可用</h1>
          <p>请检查网络连接后重试</p>
          <button onclick="window.location.reload()">重试</button>
        </body>
      </html>
      `,
      { 
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    )
  }
}

// 离线处理
async function handleOfflineFallback(request) {
  if (request.destination === 'document') {
    const offlinePage = await caches.match('/offline.html')
    return offlinePage || new Response('离线页面不可用', { status: 503 })
  }
  
  return new Response('资源不可用', { status: 503 })
}

// 后台更新静态资源
async function updateStaticCache(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      await cache.put(request, response)
    }
  } catch (error) {
    console.log('[SW] 后台更新失败:', request.url)
  }
}

// 判断是否为静态资源
function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)(\?.*)?$/.test(url) ||
         url.includes('/_next/static/')
}

// 消息处理
self.addEventListener('message', (event) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    case 'CACHE_URLS':
      if (payload && payload.urls) {
        cacheUrls(payload.urls)
      }
      break
    case 'CLEAR_CACHE':
      clearAllCaches()
      break
    default:
      console.log('[SW] 未知消息类型:', type)
  }
})

// 缓存指定URL
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE)
  return Promise.all(
    urls.map(url => 
      fetch(url)
        .then(response => response.ok ? cache.put(url, response) : null)
        .catch(err => console.log('[SW] 缓存URL失败:', url, err))
    )
  )
}

// 清理所有缓存
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  return Promise.all(cacheNames.map(name => caches.delete(name)))
}