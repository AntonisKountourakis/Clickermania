"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false)
  const [touchOptimized, setTouchOptimized] = useState(false)
  const [reducedAnimations, setReducedAnimations] = useState(false)
  const [preserveDesktopStyle, setPreserveDesktopStyle] = useState(true)

  // Αναφορά για την αποθήκευση του αποτελέσματος του ελέγχου απόδοσης
  const performanceCheckedRef = useRef(false)

  useEffect(() => {
    // Έλεγχος αν η συσκευή είναι κινητή
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const isMobileDevice = mobileRegex.test(userAgent) || window.innerWidth < 768
      setIsMobile(isMobileDevice)

      // Αυτόματη ενεργοποίηση της βελτιστοποίησης αφής για κινητές συσκευές
      setTouchOptimized(isMobileDevice)
    }

    // Βελτιωμένος έλεγχος απόδοσης συσκευής
    const checkPerformance = () => {
      if (performanceCheckedRef.current) return
      performanceCheckedRef.current = true

      // Έλεγχος για hardware concurrency (CPU cores)
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4

      // Έλεγχος για device memory (αν είναι διαθέσιμο)
      const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4

      // Έλεγχος για προτίμηση μειωμένης κίνησης
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setReducedAnimations(prefersReducedMotion)

      // Έλεγχος απόδοσης με απλό τεστ
      let slowDevice = false
      if (window.performance) {
        const startTime = performance.now()

        // Απλό τεστ απόδοσης - δημιουργία και χειρισμός ενός μεγάλου πίνακα
        const arr = new Array(10000)
        for (let i = 0; i < 10000; i++) {
          arr[i] = Math.sqrt(i)
        }

        const endTime = performance.now()
        slowDevice = endTime - startTime > 20 // Αν η λειτουργία διαρκεί περισσότερο από 20ms
      }

      // Έλεγχος για χαμηλό ρυθμό ανανέωσης οθόνης
      let lowRefreshRate = false
      try {
        // @ts-ignore - Το screen.refresh μπορεί να μην υποστηρίζεται σε όλους τους browsers
        if (window.screen && window.screen.refresh && window.screen.refresh < 60) {
          lowRefreshRate = true
        }
      } catch (e) {
        // Αγνόηση σφαλμάτων αν το API δεν υποστηρίζεται
      }

      // Συνδυασμός όλων των ελέγχων
      const isLowPerf = lowCores || lowMemory || slowDevice || lowRefreshRate
      setIsLowPerformanceDevice(isLowPerf)

      // Αν η συσκευή είναι χαμηλής απόδοσης, ενεργοποιούμε τις βελτιστοποιήσεις
      if (isLowPerf) {
        setReducedAnimations(true)
        setPreserveDesktopStyle(false)
      }
    }

    // Έλεγχος για υποστήριξη αφής
    const checkTouchSupport = () => {
      const hasTouchSupport =
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0

      if (hasTouchSupport) {
        setTouchOptimized(true)

        // Προσθήκη κλάσης στο body για CSS selectors
        document.body.classList.add("touch-device")
      }
    }

    checkMobile()
    checkPerformance()
    checkTouchSupport()

    // Προσθήκη event listeners για αλλαγές στο μέγεθος του παραθύρου
    window.addEventListener("resize", checkMobile)

    // Προσθήκη event listener για αλλαγές στην προτίμηση μειωμένης κίνησης
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedAnimations(e.matches)
    }

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange)

    return () => {
      window.removeEventListener("resize", checkMobile)
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange)
    }
  }, [])

  // Βελτιωμένη συνάρτηση για τη λήψη του βέλτιστου μεγέθους στόχου αφής
  const getTouchTargetSize = useCallback(() => {
    if (!isMobile) return 44 // Προεπιλεγμένο μέγεθος για desktop

    // Για κινητές συσκευές, χρησιμοποιούμε μεγαλύτερο μέγεθος
    const devicePixelRatio = window.devicePixelRatio || 1

    // Προσαρμογή μεγέθους με βάση την πυκνότητα pixel
    if (devicePixelRatio >= 3) {
      return 56 // Για συσκευές υψηλής ανάλυσης (π.χ. iPhone Pro)
    } else if (devicePixelRatio >= 2) {
      return 48 // Για συσκευές μεσαίας ανάλυσης
    } else {
      return 44 // Για συσκευές χαμηλής ανάλυσης
    }
  }, [isMobile])

  // Συνάρτηση για την απενεργοποίηση της καθυστέρησης αφής 300ms
  useEffect(() => {
    if (isMobile && touchOptimized) {
      // Προσθήκη meta viewport για απενεργοποίηση της καθυστέρησης αφής
      let viewportMeta = document.querySelector('meta[name="viewport"]')

      if (!viewportMeta) {
        viewportMeta = document.createElement("meta")
        viewportMeta.setAttribute("name", "viewport")
        document.head.appendChild(viewportMeta)
      }

      viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")

      // Προσθήκη CSS για βελτιστοποίηση αφής
      const style = document.createElement("style")
      style.textContent = `
        * {
          touch-action: manipulation;
        }
        
        .touch-optimized {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          -webkit-user-select: none;
        }
        
        button, [role="button"], a, input[type="button"], input[type="submit"] {
          touch-action: manipulation;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [isMobile, touchOptimized])

  return {
    isMobile,
    isLowPerformanceDevice,
    touchOptimized,
    reducedAnimations,
    preserveDesktopStyle,
    getTouchTargetSize,
    // Νέες λειτουργίες
    setTouchOptimized,
    setReducedAnimations,
    setPreserveDesktopStyle,
  }
}

/**
 * Hook για βελτιστοποίηση της κύλισης σε κινητές συσκευές
 * @returns Αντικείμενο με συναρτήσεις και τιμές για βελτιστοποίηση κύλισης
 */
export function useScrollOptimization() {
  const { isMobile, isLowPerformanceDevice: isLowPerformance } = useMobileOptimization()

  // Βέλτιστη συμπεριφορά κύλισης με βάση τη συσκευή
  const scrollBehavior = useMemo<ScrollBehavior>(() => {
    if (isLowPerformance) return "auto"
    return isMobile ? "smooth" : "smooth"
  }, [isMobile, isLowPerformance])

  // Βέλτιστη διάρκεια κύλισης με βάση τη συσκευή
  const scrollDuration = useMemo(() => {
    if (isLowPerformance) return 0
    return isMobile ? 300 : 300
  }, [isMobile, isLowPerformance])

  // Βέλτιστη συνάρτηση easing με βάση τη συσκευή
  const scrollEasing = useCallback(
    (t: number) => {
      // Απλή γραμμική συνάρτηση για συσκευές χαμηλής απόδοσης
      if (isLowPerformance) return t

      // Cubic easing για καλύτερη εμπειρία σε κανονικές συσκευές
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    [isLowPerformance],
  )

  // Συνάρτηση για ομαλή κύλιση σε συγκεκριμένο στοιχείο
  const smoothScrollTo = useCallback(
    (
      element: HTMLElement | null,
      to: number,
      options?: {
        axis?: "x" | "y"
        duration?: number
        easing?: (t: number) => number
      },
    ) => {
      if (!element) return

      const { axis = "x", duration = scrollDuration, easing = scrollEasing } = options || {}

      // Χρήση της native scrollTo για συσκευές χαμηλής απόδοσης
      if (isLowPerformance) {
        if (axis === "x") {
          element.scrollTo({ left: to, behavior: "auto" })
        } else {
          element.scrollTo({ top: to, behavior: "auto" })
        }
        return
      }

      // Χρήση της προσαρμοσμένης συνάρτησης για ομαλή κύλιση
      import("../utils/performance-tracking").then((module) => {
        module.smoothScroll(element, to, duration, axis, easing)
      })
    },
    [scrollDuration, scrollEasing, isLowPerformance],
  )

  return {
    scrollBehavior,
    scrollDuration,
    scrollEasing,
    smoothScrollTo,
    isLowPerformance,
  }
}
