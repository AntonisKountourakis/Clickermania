"use client"

import { useState, useMemo, useCallback } from "react"
import { useMobileOptimization } from "./use-mobile-optimization"

type ScrollBehavior = "auto" | "smooth"

interface UseScrollOptimizationResult {
  scrollBehavior: ScrollBehavior
  scrollDuration: number
  scrollEasing: (t: number) => number
  smoothScrollTo: (
    element: HTMLElement | null,
    to: number,
    options?: { axis?: "x" | "y"; duration?: number; easing?: (t: number) => number },
  ) => void
  isLowPerformance: boolean
}

export function useScrollOptimization() {
  const { isMobile, isLowPerformanceDevice } = useMobileOptimization()
  const [isScrolling, setIsScrolling] = useState(false)

  // Βέλτιστη συμπεριφορά κύλισης με βάση τη συσκευή
  const scrollBehavior = useMemo<ScrollBehavior>(() => {
    return "auto" // Always use "auto" regardless of device performance
  }, [])

  // Συνάρτηση για άμεση κύλιση σε συγκεκριμένο στοιχείο
  const smoothScrollTo = useCallback(
    (element: HTMLElement | null, to: number, options?: { axis?: "x" | "y"; behavior?: ScrollBehavior }) => {
      if (!element) return

      const { axis = "x" } = options || {}

      // Ορίζουμε ότι γίνεται κύλιση
      setIsScrolling(true)

      // Κύλιση με άμεση συμπεριφορά
      if (axis === "x") {
        element.scrollTo({
          left: to,
          behavior: "auto",
        })
      } else {
        element.scrollTo({
          top: to,
          behavior: "auto",
        })
      }

      // Ορίζουμε ότι η κύλιση ολοκληρώθηκε σχεδόν αμέσως
      setTimeout(() => {
        setIsScrolling(false)
      }, 50)
    },
    [],
  )

  // Βελτιωμένη συνάρτηση για κύλιση με animation
  const animatedScrollTo = useCallback(
    (element: HTMLElement | null, to: number, options?: { axis?: "x" | "y"; duration?: number }) => {
      if (!element) return

      const { axis = "x", duration = 300 } = options || {}

      // Ορίζουμε ότι γίνεται κύλιση
      setIsScrolling(true)

      // Αρχική θέση
      const start = axis === "x" ? element.scrollLeft : element.scrollTop
      const distance = to - start
      const startTime = performance.now()

      // Συνάρτηση animation
      const animateScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / duration, 1)

        // Easing function (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        const position = start + distance * easeProgress

        if (axis === "x") {
          element.scrollLeft = position
        } else {
          element.scrollTop = position
        }

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else {
          setIsScrolling(false)
        }
      }

      requestAnimationFrame(animateScroll)
    },
    [],
  )

  return {
    scrollBehavior,
    smoothScrollTo,
    animatedScrollTo,
    isScrolling,
    isMobile,
    isLowPerformance: isLowPerformanceDevice,
  }
}
