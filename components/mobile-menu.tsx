"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(true) // Start with menu open
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Function to create a click sound using Web Audio API
  const playClickSound = () => {
    try {
      // Check if audio is muted (get from localStorage)
      if (typeof window !== "undefined") {
        const isMuted = localStorage.getItem("audio-muted") === "true"
        if (isMuted) return
      }

      // Create AudioContext on demand
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const context = new AudioContext()

      // Create oscillator for a simple click sound
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      // Configure oscillator
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(800, context.currentTime) // Click frequency

      // Configure gain (volume)
      gainNode.gain.setValueAtTime(0.3, context.currentTime) // Start at 30% volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1) // Quick fade out

      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Play sound
      oscillator.start()
      oscillator.stop(context.currentTime + 0.1) // Short duration
    } catch (err) {
      console.error("Error playing click sound:", err)
    }
  }

  // Handle menu item click
  const handleMenuItemClick = () => {
    playClickSound()
    setIsOpen(false)
  }

  return null
}
