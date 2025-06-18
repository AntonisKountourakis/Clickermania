"use client"

import { useState, useEffect, useRef } from "react"

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  color: string
}

export function BubbleEffect() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [popped, setPopped] = useState<number[]>([])
  const animationRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)

  // Create new bubbles periodically - reduced frequency and max count
  useEffect(() => {
    // Simpler colors with higher transparency for better performance
    const colors = [
      "rgba(0, 123, 255, 0.3)", // Blue
      "rgba(255, 105, 180, 0.3)", // Pink
      "rgba(50, 205, 50, 0.3)", // Green
      "rgba(255, 215, 0, 0.3)", // Gold
      "rgba(255, 69, 0, 0.3)", // Orange
    ]

    const interval = setInterval(() => {
      if (bubbles.length < 5) {
        // Reduced from 8 to 5 max bubbles
        const newBubble: Bubble = {
          id: Date.now(),
          x: Math.random() * (window.innerWidth - 100),
          y: window.innerHeight + Math.random() * 100,
          size: Math.random() * 40 + 20, // Slightly smaller bubbles (20-60px)
          speedY: Math.random() * 1.2 + 0.8, // Slightly slower
          speedX: (Math.random() - 0.5) * 0.3, // Less side movement
          color: colors[Math.floor(Math.random() * colors.length)],
        }
        setBubbles((prev) => [...prev, newBubble])
      }
    }, 2000) // Slower bubble creation (2s instead of 1.5s)

    return () => clearInterval(interval)
  }, [bubbles.length])

  // More efficient animation with throttled updates
  useEffect(() => {
    const animateBubbles = (timestamp: number) => {
      // Only update every 50ms (20fps) instead of every frame
      if (timestamp - lastUpdateTimeRef.current > 50) {
        lastUpdateTimeRef.current = timestamp

        setBubbles((prevBubbles) => {
          // Filter out bubbles that have gone off the top
          const visibleBubbles = prevBubbles.filter((bubble) => bubble.y + bubble.size > 0)

          // Update positions of remaining bubbles
          return visibleBubbles.map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speedY,
            // Simpler movement pattern
            x: bubble.x + Math.sin(timestamp / 2000 + bubble.id) * bubble.speedX,
          }))
        })
      }

      animationRef.current = requestAnimationFrame(animateBubbles)
    }

    animationRef.current = requestAnimationFrame(animateBubbles)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Simplified bubble popping
  const handlePop = (id: number) => {
    setPopped((prev) => [...prev, id])

    // Remove bubble immediately without animation
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id))

    // Clean up popped array after a short delay
    setTimeout(() => {
      setPopped((prev) => prev.filter((poppedId) => poppedId !== id))
    }, 100)
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {bubbles.map((bubble) => {
        const isPoppedBubble = popped.includes(bubble.id)
        if (isPoppedBubble) return null // Don't render popped bubbles at all

        return (
          <div
            key={bubble.id}
            className="absolute rounded-full cursor-pointer pointer-events-auto"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
              // Simplified gradient with fewer color stops
              background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), ${bubble.color})`,
              // Lighter shadow effect
              boxShadow: `0 0 8px ${bubble.color}`,
              border: `1px solid ${bubble.color.replace("0.3", "0.5")}`,
            }}
            onClick={() => handlePop(bubble.id)}
          >
            {/* Single highlight for better performance */}
            <div
              className="absolute rounded-full bg-white opacity-50"
              style={{
                width: "20%",
                height: "20%",
                top: "15%",
                left: "15%",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
