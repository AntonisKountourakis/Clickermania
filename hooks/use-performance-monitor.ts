"use client"

import { useState, useEffect, useCallback } from "react"

interface PerformanceData {
  fps: number
  averageFps: number
  isLowPerformance: boolean
  deviceTier: "low" | "medium" | "high"
}

export function usePerformanceMonitor(sampleSize = 10): PerformanceData {
  const [fps, setFps] = useState(60)
  const [fpsHistory, setFpsHistory] = useState<number[]>([])
  const [averageFps, setAverageFps] = useState(60)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const [deviceTier, setDeviceTier] = useState<"low" | "medium" | "high">("medium")

  // Detect device capabilities
  useEffect(() => {
    const detectDeviceTier = () => {
      // Check hardware concurrency (number of logical processors)
      const concurrency = navigator.hardwareConcurrency || 0

      // Check device memory if available
      const memory = (navigator as any).deviceMemory || 0

      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Determine device tier
      if (isMobile) {
        if (concurrency <= 4 || memory <= 2) {
          return "low"
        } else if (concurrency <= 6 || memory <= 4) {
          return "medium"
        } else {
          return "high"
        }
      } else {
        // Desktop devices generally have better performance
        if (concurrency <= 2 || memory <= 2) {
          return "low"
        } else if (concurrency <= 4 || memory <= 8) {
          return "medium"
        } else {
          return "high"
        }
      }
    }

    setDeviceTier(detectDeviceTier())
  }, [])

  // FPS monitoring
  const measureFps = useCallback(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let rafId: number

    const countFrame = (time: number) => {
      frameCount++

      // Calculate FPS every second
      if (time - lastTime >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / (time - lastTime))
        setFps(currentFps)

        // Update FPS history
        setFpsHistory((prev) => {
          const newHistory = [...prev, currentFps].slice(-sampleSize)

          // Calculate average FPS
          const avg = Math.round(newHistory.reduce((sum, val) => sum + val, 0) / newHistory.length)
          setAverageFps(avg)

          // Determine if device is low performance
          setIsLowPerformance(avg < 30)

          return newHistory
        })

        frameCount = 0
        lastTime = time
      }

      rafId = requestAnimationFrame(countFrame)
    }

    rafId = requestAnimationFrame(countFrame)

    return () => cancelAnimationFrame(rafId)
  }, [sampleSize])

  useEffect(() => {
    const cleanup = measureFps()
    return cleanup
  }, [measureFps])

  return { fps, averageFps, isLowPerformance, deviceTier }
}
