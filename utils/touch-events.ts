"use client"

import React from "react"

// Utility functions for handling touch events

// Βελτιωμένη συνάρτηση για λήψη συντεταγμένων αφής
export function getTouchCoordinates(event: React.TouchEvent | TouchEvent): {
  clientX: number
  clientY: number
  timestamp: number
} {
  const touch = event.touches[0] || event.changedTouches[0]
  return {
    clientX: touch.clientX,
    clientY: touch.clientY,
    timestamp: event.timeStamp || Date.now(),
  }
}

// Βελτιωμένη συνάρτηση για αποτροπή προεπιλεγμένης συμπεριφοράς αφής
export function preventTouchDefault(event: React.TouchEvent | TouchEvent): void {
  if (event.cancelable) {
    event.preventDefault()
  }
}

// Βελτιωμένη συνάρτηση για ανίχνευση swipe με υποστήριξη ταχύτητας
export function detectSwipe(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  startTime: number,
  endTime: number,
  minDistance = 50,
  maxTime = 300,
): { direction: "left" | "right" | "up" | "down" | null; velocity: number } {
  const deltaX = endX - startX
  const deltaY = endY - startY
  const timeElapsed = endTime - startTime

  // Έλεγχος αν η κίνηση ήταν αρκετά γρήγορη για να θεωρηθεί swipe
  if (timeElapsed > maxTime) {
    return { direction: null, velocity: 0 }
  }

  // Υπολογισμός ταχύτητας σε pixels/ms
  const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / timeElapsed

  // Έλεγχος αν η απόσταση είναι σημαντική
  if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
    return { direction: null, velocity }
  }

  // Προσδιορισμός αν το swipe είναι οριζόντιο ή κάθετο
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return { direction: deltaX > 0 ? "right" : "left", velocity }
  } else {
    return { direction: deltaY > 0 ? "down" : "up", velocity }
  }
}

// Βελτιωμένη συνάρτηση για debounce χειριστών αφής
export function debounceTouchHandler<T extends (...args: any[]) => any>(
  handler: T,
  delay = 100, // Μειωμένη καθυστέρηση για πιο άμεση ανταπόκριση
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      handler(...args)
      timeout = null
    }, delay)
  }
}

// Βελτιωμένο custom hook για χειρισμό συμβάντων αφής
export function useTouchEvents(
  options = {
    preventScroll: true,
    minDistance: 30,
    maxTime: 300,
  },
) {
  const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0, time: 0 })
  const [touchEnd, setTouchEnd] = React.useState({ x: 0, y: 0, time: 0 })
  const [isSwiping, setIsSwiping] = React.useState(false)
  const [swipeDirection, setSwipeDirection] = React.useState<"left" | "right" | "up" | "down" | null>(null)
  const [swipeVelocity, setSwipeVelocity] = React.useState(0)

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (e.touches.length !== 1) return // Χειρισμός μόνο μονών αγγιγμάτων

      const { clientX, clientY, timestamp } = getTouchCoordinates(e)
      setTouchStart({ x: clientX, y: clientY, time: timestamp })
      setIsSwiping(true)
      setSwipeDirection(null)

      // Αποτροπή κύλισης σελίδας αν χρειάζεται
      if (options.preventScroll && e.cancelable) {
        e.preventDefault()
      }
    },
    [options.preventScroll],
  )

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (!isSwiping || e.touches.length !== 1) return

      const { clientX, clientY, timestamp } = getTouchCoordinates(e)
      setTouchEnd({ x: clientX, y: clientY, time: timestamp })

      // Υπολογισμός προσωρινής κατεύθυνσης για ανατροφοδότηση σε πραγματικό χρόνο
      const { direction, velocity } = detectSwipe(
        touchStart.x,
        touchStart.y,
        clientX,
        clientY,
        touchStart.time,
        timestamp,
        options.minDistance,
        options.maxTime,
      )

      if (direction) {
        setSwipeDirection(direction)
        setSwipeVelocity(velocity)
      }
    },
    [isSwiping, touchStart, options.minDistance, options.maxTime],
  )

  const handleTouchEnd = React.useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (!isSwiping) return

      const { clientX, clientY, timestamp } = getTouchCoordinates(e)
      const finalTouchEnd = { x: clientX, y: clientY, time: timestamp }
      setTouchEnd(finalTouchEnd)

      // Τελικός υπολογισμός κατεύθυνσης
      const { direction, velocity } = detectSwipe(
        touchStart.x,
        touchStart.y,
        finalTouchEnd.x,
        finalTouchEnd.y,
        touchStart.time,
        finalTouchEnd.time,
        options.minDistance,
        options.maxTime,
      )

      setSwipeDirection(direction)
      setSwipeVelocity(velocity)
      setIsSwiping(false)

      return { direction, velocity }
    },
    [isSwiping, touchStart, options.minDistance, options.maxTime],
  )

  const handleTouchCancel = React.useCallback(() => {
    setIsSwiping(false)
    setSwipeDirection(null)
    setSwipeVelocity(0)
  }, [])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    isSwiping,
    touchStart,
    touchEnd,
    swipeDirection,
    swipeVelocity,
  }
}

// Νέο hook για βελτιστοποιημένη κύλιση με αφή
export function useOptimizedTouchScroll(
  containerRef: React.RefObject<HTMLElement>,
  options = {
    snapToItems: true,
    itemSelector: ".scroll-item",
    preventVerticalScroll: true,
  },
) {
  const [isScrolling, setIsScrolling] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const startXRef = React.useRef(0)
  const startYRef = React.useRef(0)
  const startTimeRef = React.useRef(0)
  const lastXRef = React.useRef(0)
  const velocityRef = React.useRef(0)
  const directionRef = React.useRef<"horizontal" | "vertical" | null>(null)

  const handleTouchStart = React.useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length !== 1) return

      startXRef.current = e.touches[0].clientX
      startYRef.current = e.touches[0].clientY
      lastXRef.current = e.touches[0].clientX
      startTimeRef.current = Date.now()
      setIsScrolling(true)
      directionRef.current = null
      velocityRef.current = 0
    },
    [containerRef],
  )

  const handleTouchMove = React.useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current || !isScrolling || e.touches.length !== 1) return

      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const deltaX = startXRef.current - currentX
      const deltaY = startYRef.current - currentY

      // Προσδιορισμός κατεύθυνσης κύλισης αν δεν έχει οριστεί ακόμα
      if (!directionRef.current) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          directionRef.current = "horizontal"
        } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
          directionRef.current = "vertical"
        }
      }

      // Αν η κύλιση είναι οριζόντια, αποτρέπουμε την προεπιλεγμένη συμπεριφορά
      if (directionRef.current === "horizontal") {
        if (options.preventVerticalScroll) {
          e.preventDefault()
        }

        // Υπολογισμός ταχύτητας
        const now = Date.now()
        const elapsed = now - startTimeRef.current
        if (elapsed > 0) {
          velocityRef.current = Math.abs(currentX - lastXRef.current) / elapsed
        }

        // Κύλιση του container
        containerRef.current.scrollLeft += lastXRef.current - currentX
        lastXRef.current = currentX
      }
    },
    [containerRef, isScrolling, options.preventVerticalScroll],
  )

  const handleTouchEnd = React.useCallback(() => {
    if (!containerRef.current || !isScrolling) return

    setIsScrolling(false)

    // Snap to closest item if enabled
    if (options.snapToItems) {
      const containerWidth = containerRef.current.clientWidth
      const scrollLeft = containerRef.current.scrollLeft

      // Υπολογισμός του πλησιέστερου δείκτη
      const targetIndex = Math.round(scrollLeft / containerWidth)

      // Εφαρμογή της κύλισης
      containerRef.current.scrollTo({
        left: targetIndex * containerWidth,
        behavior: "auto",
      })

      setCurrentIndex(targetIndex)
    }
  }, [containerRef, isScrolling, options.snapToItems])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })
    container.addEventListener("touchcancel", () => setIsScrolling(false), { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchcancel", () => setIsScrolling(false))
    }
  }, [containerRef, handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    isScrolling,
    currentIndex,
    scrollToIndex: (index: number) => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        containerRef.current.scrollTo({
          left: index * containerWidth,
          behavior: "auto",
        })
        setCurrentIndex(index)
      }
    },
  }
}
