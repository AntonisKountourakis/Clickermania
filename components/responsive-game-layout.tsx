"use client"

import type { ReactNode } from "react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"
import { getSafeAreaInsets } from "@/utils/mobile-optimization"

interface ResponsiveGameLayoutProps {
  children: ReactNode
  className?: string
  backgroundClass?: string
  preserveDesktopStyle?: boolean
}

export function ResponsiveGameLayout({
  children,
  className = "",
  backgroundClass = "",
  preserveDesktopStyle = true,
}: ResponsiveGameLayoutProps) {
  const { isMobile, touchOptimized, viewportHeight } = useMobileOptimization({
    preserveDesktopStyle,
  })

  const safeAreaInsets = getSafeAreaInsets()

  // Apply mobile-specific styles while preserving desktop appearance
  const mobileStyles = isMobile
    ? {
        minHeight: viewportHeight ? `${viewportHeight}px` : "100vh",
        paddingTop: `${safeAreaInsets.top}px`,
        paddingBottom: `${safeAreaInsets.bottom}px`,
        paddingLeft: `${safeAreaInsets.left}px`,
        paddingRight: `${safeAreaInsets.right}px`,
        touchAction: touchOptimized ? "manipulation" : "auto",
        WebkitTapHighlightColor: "transparent",
        // Preserve desktop-like appearance on mobile
        maxWidth: preserveDesktopStyle ? "100%" : "none",
        margin: "0 auto",
      }
    : {}

  return (
    <div
      className={`game-container ${backgroundClass} ${className} ${isMobile ? "mobile-optimized" : ""}`}
      style={mobileStyles}
    >
      {children}
    </div>
  )
}
