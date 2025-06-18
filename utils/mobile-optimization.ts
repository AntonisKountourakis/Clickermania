// Utils for optimizing performance on mobile devices

// Device detection helper
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
}

// Optimize animations based on device
export function getReducedAnimations(): boolean {
  if (typeof window === "undefined") return false

  // Check for device and prefers-reduced-motion
  const isMobile = isMobileDevice()
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return isMobile || prefersReducedMotion
}

// Determine appropriate image quality based on device
export function getImageQuality(): "low" | "medium" | "high" {
  if (typeof window === "undefined") return "medium"

  // Check connection type if available
  const connection = (navigator as any).connection

  if (connection) {
    const effectiveType = connection.effectiveType

    if (effectiveType === "4g") return "high"
    if (effectiveType === "3g") return "medium"
    return "low"
  }

  // Fallback based on device
  return isMobileDevice() ? "medium" : "high"
}

// Get appropriate grid columns for device
export function getResponsiveGridCols(): number {
  if (typeof window === "undefined") return 4

  const width = window.innerWidth

  if (width < 640) return 2 // Small mobile
  if (width < 768) return 3 // Large mobile
  if (width < 1024) return 4 // Tablet
  return 5 // Desktop
}

// Throttle events for better performance
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let lastFunc: number
  let lastRan: number

  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = window.setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  }
}

// Optimize touch targets for mobile
export function getTouchTargetSize(): number {
  if (typeof window === "undefined") return 44 // Default minimum touch target size

  // Return larger touch targets for mobile
  return isMobileDevice() ? 44 : 32
}

// Get device pixel ratio for high-DPI screens
export function getDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1
  return window.devicePixelRatio || 1
}

// Check if device supports touch
export function supportsTouchEvents(): boolean {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

// Get optimal button size based on device
export function getOptimalButtonSize(): "small" | "medium" | "large" {
  if (typeof window === "undefined") return "medium"

  const width = window.innerWidth

  if (width < 640) return "large" // Larger buttons on small screens
  if (width < 1024) return "medium"
  return "small"
}

// Calculate safe area insets for notched devices
export function getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
  if (typeof window === "undefined") return { top: 0, right: 0, bottom: 0, left: 0 }

  // Default values
  const insets = { top: 0, right: 0, bottom: 0, left: 0 }

  // Try to get environment variables if available
  const computedStyle = window.getComputedStyle(document.documentElement)

  const safeAreaTop = computedStyle.getPropertyValue("--sat") || computedStyle.getPropertyValue("--safe-area-inset-top")
  const safeAreaRight =
    computedStyle.getPropertyValue("--sar") || computedStyle.getPropertyValue("--safe-area-inset-right")
  const safeAreaBottom =
    computedStyle.getPropertyValue("--sab") || computedStyle.getPropertyValue("--safe-area-inset-bottom")
  const safeAreaLeft =
    computedStyle.getPropertyValue("--sal") || computedStyle.getPropertyValue("--safe-area-inset-left")

  if (safeAreaTop) insets.top = Number.parseInt(safeAreaTop, 10)
  if (safeAreaRight) insets.right = Number.parseInt(safeAreaRight, 10)
  if (safeAreaBottom) insets.bottom = Number.parseInt(safeAreaBottom, 10)
  if (safeAreaLeft) insets.left = Number.parseInt(safeAreaLeft, 10)

  return insets
}
