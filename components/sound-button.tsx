"use client"

import { useEffect, useState, useRef } from "react"

export function SoundButton() {
  const [isMuted, setIsMuted] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioInitializedRef = useRef(false)
  const playAttemptTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if sound is muted in localStorage
    const storedMuted = localStorage.getItem("audio-muted")
    if (storedMuted !== null) {
      setIsMuted(storedMuted === "true")
    }

    // Mark as initialized after first render
    setIsInitialized(true)

    // Cleanup function
    return () => {
      if (playAttemptTimeoutRef.current) {
        clearTimeout(playAttemptTimeoutRef.current)
      }
    }
  }, [])

  // Effect to handle audio state changes
  useEffect(() => {
    if (isInitialized) {
      handleAudioState(isMuted)
    }
  }, [isMuted, isInitialized])

  const handleAudioState = (muted: boolean) => {
    try {
      const bgMusic = document.getElementById("background-music") as HTMLAudioElement | null
      const clickSound = document.getElementById("click-sound") as HTMLAudioElement | null

      if (!bgMusic || !clickSound) return

      // Update muted state for both audio elements
      bgMusic.muted = muted
      clickSound.muted = muted

      // If unmuting and not yet initialized, initialize audio
      if (!muted && !audioInitializedRef.current) {
        initializeAudio()
      }

      // If unmuting and already initialized, try to play
      if (!muted && audioInitializedRef.current) {
        // Use a small timeout to avoid rapid play/pause calls
        if (playAttemptTimeoutRef.current) {
          clearTimeout(playAttemptTimeoutRef.current)
        }

        playAttemptTimeoutRef.current = setTimeout(() => {
          if (bgMusic.paused) {
            bgMusic.play().catch((err) => {
              console.warn("Background music play failed:", err.message)
            })
          }
        }, 300)
      }
    } catch (e) {
      console.error("Error handling audio state:", e)
    }
  }

  const toggleSound = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)

    // Save to localStorage
    localStorage.setItem("audio-muted", newMuted.toString())

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("sound-toggle", {
        detail: { muted: newMuted },
      }),
    )
  }

  // Function to initialize audio
  const initializeAudio = () => {
    try {
      // Try to initialize background music
      const bgMusic = document.getElementById("background-music") as HTMLAudioElement
      if (bgMusic) {
        // Set the src attribute if needed
        if (!bgMusic.src && bgMusic.getAttribute("data-src")) {
          bgMusic.src = bgMusic.getAttribute("data-src") || ""
        }

        bgMusic.volume = 0.2

        // Use a small timeout to ensure the audio element is ready
        setTimeout(() => {
          bgMusic.play().catch((err) => {
            console.warn("Initial background music play failed:", err.message)
          })
        }, 100)
      }

      // Try to initialize click sound
      const clickSound = document.getElementById("click-sound") as HTMLAudioElement
      if (clickSound) {
        // Set the src attribute if needed
        if (!clickSound.src && clickSound.getAttribute("data-src")) {
          clickSound.src = clickSound.getAttribute("data-src") || ""
        }

        clickSound.volume = 0.5
        clickSound.load()
      }

      audioInitializedRef.current = true
    } catch (e) {
      console.error("Error initializing audio:", e)
    }
  }

  if (!isInitialized) return null

  // Button removed as requested
  return null
}
