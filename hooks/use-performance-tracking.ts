"use client"

import { useEffect, useRef } from "react"
import { startPerformanceTracking, endPerformanceTracking, trackComponentRender } from "@/utils/performance-tracking"

/**
 * Hook to track component render performance
 * @param componentName Name of the component
 */
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    return trackComponentRender(componentName)
  }, [componentName])
}

/**
 * Hook to track effect performance
 * @param effectName Name of the effect
 * @param dependencies Effect dependencies
 */
export function usePerformanceEffect(effectName: string, effect: () => void | (() => void), dependencies: any[] = []) {
  useEffect(() => {
    startPerformanceTracking(`effect-${effectName}`)
    const cleanup = effect()
    endPerformanceTracking(`effect-${effectName}`)

    return () => {
      if (cleanup) {
        startPerformanceTracking(`cleanup-${effectName}`)
        cleanup()
        endPerformanceTracking(`cleanup-${effectName}`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

/**
 * Hook to track callback performance
 * @param callbackName Name of the callback
 * @param callback The callback function
 * @returns The tracked callback
 */
export function usePerformanceCallback<T extends (...args: any[]) => any>(callbackName: string, callback: T): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const trackedCallback = useRef((...args: Parameters<T>): ReturnType<T> => {
    startPerformanceTracking(`callback-${callbackName}`)
    const result = callbackRef.current(...args)
    endPerformanceTracking(`callback-${callbackName}`)
    return result as ReturnType<T>
  })

  return trackedCallback.current as T
}
