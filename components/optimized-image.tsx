"use client"

import { useState } from "react"
import Image from "next/image"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: string | "blur" | "empty"
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder,
  sizes = "100vw",
}: OptimizedImageProps) {
  const { imageQuality, isMobile } = useMobileOptimization()
  const [loading, setLoading] = useState(true)

  // Adjust image quality/size based on device capability
  let optimizedSrc = src
  if (src.includes("/placeholder.svg")) {
    // For placeholder SVGs, reduce size on mobile
    const mobileWidth = width ? Math.floor(width * 0.7) : undefined
    const mobileHeight = height ? Math.floor(height * 0.7) : undefined

    if (isMobile && mobileWidth && mobileHeight) {
      optimizedSrc = src
        .replace(`width=${width}`, `width=${mobileWidth}`)
        .replace(`height=${height}`, `height=${mobileHeight}`)
    }
  }

  // Calculate mobile dimensions
  const mobileWidth = isMobile && width ? Math.floor(width * 0.8) : width
  const mobileHeight = isMobile && height ? Math.floor(height * 0.8) : height

  // Determine loading strategy
  const lazyLoad = !priority && !isMobile

  return (
    <div className={`relative ${className || ""}`} style={{ opacity: loading ? 0.7 : 1, transition: "opacity 0.3s" }}>
      <Image
        src={optimizedSrc || "/placeholder.svg"}
        alt={alt}
        width={mobileWidth}
        height={mobileHeight}
        priority={priority || isMobile}
        loading={lazyLoad ? "lazy" : undefined}
        sizes={sizes}
        placeholder={placeholder}
        onLoad={() => setLoading(false)}
        className={`transition-opacity ${loading ? "opacity-70" : "opacity-100"}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
