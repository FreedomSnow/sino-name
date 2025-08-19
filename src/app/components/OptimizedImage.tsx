'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
}

// 生成简单的blurDataURL
const generateBlurDataURL = (width: number, height: number) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(240,240,240);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(220,220,220);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 400,
  priority = false,
  className = '',
  placeholder = 'blur',
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center rounded ${className}`}
        style={{ width, height }}
        aria-label={`图片加载失败: ${alt}`}
        role="img"
      >
        <span className="text-gray-400 text-sm">图片无法加载</span>
      </div>
    )
  }

  const finalBlurDataURL = blurDataURL || (placeholder === 'blur' ? generateBlurDataURL(width, height) : undefined)

  return (
    <div className={`relative overflow-hidden rounded ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={finalBlurDataURL}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        quality={85}
      />
      
      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}