"use client"

import type React from "react"
import { useState, useRef, useEffect, type ReactNode } from "react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

interface SwipeContainerProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  className?: string
  disableOnDesktop?: boolean
  preventScroll?: boolean
}

export function SwipeContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  className = "",
  disableOnDesktop = true,
  preventScroll = true,
}: SwipeContainerProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [touchEndY, setTouchEndY] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"horizontal" | "vertical" | null>(null)
  const startTimeRef = useRef<number>(0)
  const swipeRef = useRef<HTMLDivElement>(null)

  // Χρήση του hook για βελτιστοποίηση κινητών συσκευών
  const { isMobile, touchOptimized } = useMobileOptimization()

  // Αν είναι απενεργοποιημένο σε desktop και δεν είναι κινητή συσκευή, απλά επιστρέφουμε τα παιδιά
  if (disableOnDesktop && !isMobile) {
    return <div className={className}>{children}</div>
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Αποφυγή πολλαπλών αγγιγμάτων
    if (e.touches.length !== 1) return

    setTouchStartX(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
    setIsSwiping(true)
    setSwipeDirection(null)
    startTimeRef.current = Date.now()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || e.touches.length !== 1) return

    const currentX = e.targetTouches[0].clientX
    const currentY = e.targetTouches[0].clientY

    // Αποθήκευση των τρεχουσών συντεταγμένων
    setTouchEndX(currentX)
    setTouchEndY(currentY)

    // Προσδιορισμός κατεύθυνσης αν δεν έχει οριστεί ακόμα
    if (!swipeDirection && touchStartX !== null && touchStartY !== null) {
      const deltaX = Math.abs(currentX - touchStartX)
      const deltaY = Math.abs(currentY - touchStartY)

      // Αν η διαφορά είναι αρκετά μεγάλη, προσδιορίζουμε την κατεύθυνση
      if (deltaX > 10 || deltaY > 10) {
        setSwipeDirection(deltaX > deltaY ? "horizontal" : "vertical")
      }
    }

    // Αν η κατεύθυνση είναι οριζόντια και θέλουμε να αποτρέψουμε την κύλιση
    if (preventScroll && swipeDirection === "horizontal") {
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) {
      setIsSwiping(false)
      return
    }

    const deltaX = touchStartX - touchEndX
    const deltaY = touchStartY - touchEndY
    const timeElapsed = Date.now() - startTimeRef.current

    // Υπολογισμός ταχύτητας σε pixels/ms
    const velocity = Math.abs(deltaX) / timeElapsed

    // Έλεγχος αν είναι οριζόντιο swipe (περισσότερο οριζόντια κίνηση από κάθετη)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)

    // Έλεγχος αν το swipe είναι αρκετά γρήγορο και μεγάλο
    const isValidSwipe = isHorizontalSwipe && Math.abs(deltaX) > threshold && timeElapsed < 300 && velocity > 0.3

    if (isValidSwipe) {
      if (deltaX > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (deltaX < 0 && onSwipeRight) {
        onSwipeRight()
      }
    }

    setIsSwiping(false)
    setTouchStartX(null)
    setTouchEndX(null)
    setTouchStartY(null)
    setTouchEndY(null)
    setSwipeDirection(null)
  }

  // Προσθήκη passive event listeners για καλύτερη απόδοση
  useEffect(() => {
    const element = swipeRef.current
    if (!element) return

    const touchStartHandler = (e: TouchEvent) => {
      if (e.touches.length !== 1) return

      setTouchStartX(e.touches[0].clientX)
      setTouchStartY(e.touches[0].clientY)
      setIsSwiping(true)
      setSwipeDirection(null)
      startTimeRef.current = Date.now()
    }

    const touchMoveHandler = (e: TouchEvent) => {
      if (!isSwiping || e.touches.length !== 1) return

      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY

      setTouchEndX(currentX)
      setTouchEndY(currentY)

      if (!swipeDirection && touchStartX !== null && touchStartY !== null) {
        const deltaX = Math.abs(currentX - touchStartX)
        const deltaY = Math.abs(currentY - touchStartY)

        if (deltaX > 10 || deltaY > 10) {
          const direction = deltaX > deltaY ? "horizontal" : "vertical"
          setSwipeDirection(direction)

          // Αν είναι οριζόντια κίνηση και θέλουμε να αποτρέψουμε την κύλιση
          if (preventScroll && direction === "horizontal" && e.cancelable) {
            e.preventDefault()
          }
        }
      }
    }

    const touchEndHandler = () => handleTouchEnd()
    const touchCancelHandler = () => {
      setIsSwiping(false)
      setTouchStartX(null)
      setTouchEndX(null)
      setTouchStartY(null)
      setTouchEndY(null)
      setSwipeDirection(null)
    }

    // Προσθήκη event listeners με passive flag για καλύτερη απόδοση
    element.addEventListener("touchstart", touchStartHandler, { passive: true })
    element.addEventListener("touchmove", touchMoveHandler, { passive: !preventScroll })
    element.addEventListener("touchend", touchEndHandler, { passive: true })
    element.addEventListener("touchcancel", touchCancelHandler, { passive: true })

    return () => {
      element.removeEventListener("touchstart", touchStartHandler)
      element.removeEventListener("touchmove", touchMoveHandler)
      element.removeEventListener("touchend", touchEndHandler)
      element.removeEventListener("touchcancel", touchCancelHandler)
    }
  }, [isMobile, isSwiping, touchStartX, touchStartY, swipeDirection, preventScroll])

  return (
    <div
      ref={swipeRef}
      className={`${className} ${touchOptimized ? "touch-optimized" : ""}`}
      style={{
        touchAction: preventScroll ? "pan-y" : "auto",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {children}
    </div>
  )
}
