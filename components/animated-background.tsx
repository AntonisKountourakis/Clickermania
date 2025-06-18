"use client"

import { useEffect, useState } from "react"
import { useSettings } from "@/contexts/settings-context"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"

interface AnimatedBackgroundProps {
  quality?: "low" | "medium" | "high"
  disableOnLowEnd?: boolean
}

export function AnimatedBackground({ quality = "medium", disableOnLowEnd = true }: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const { settings } = useSettings()
  const { isLowPerformance } = usePerformanceMonitor()

  // Only disable on very low-end devices
  const shouldDisable = disableOnLowEnd && isLowPerformance && quality === "low"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // For low-end devices, use a simpler gradient
  if (shouldDisable) {
    return (
      <div
        className="fixed inset-0 bg-gradient"
        style={{
          top: 0,
          margin: 0,
          padding: 0,
          zIndex: 0,
          background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        }}
      />
    )
  }

  // Return a colorful animated gradient background
  return (
    <div
      className="fixed inset-0 bg-gradient animate-gradient"
      style={{
        top: 0,
        margin: 0,
        padding: 0,
        zIndex: 0,
        backgroundSize: "400% 400%",
      }}
    />
  )
}
