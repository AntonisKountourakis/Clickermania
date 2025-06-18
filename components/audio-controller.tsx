"use client"

import { useEffect, useState, useRef } from "react"
import { playClickSound, initializeClickSounds } from "@/utils/click-sound"
import { useSettings } from "@/contexts/settings-context"

export function AudioController() {
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasInitialized = useRef(false)
  const { settings } = useSettings()
  const audioInitializedRef = useRef(false)

  useEffect(() => {
    // Get the audio element
    audioRef.current = document.getElementById("background-music") as HTMLAudioElement

    // Initialize click sounds
    initializeClickSounds()

    // Load mute preference from localStorage
    try {
      const savedMute = localStorage.getItem("audio-muted")
      if (savedMute === "true") {
        setIsMuted(true)
        if (audioRef.current) {
          audioRef.current.muted = true
          audioRef.current.pause()
        }
      }
    } catch (e) {
      console.error("Failed to load mute preference:", e)
    }

    // Listen for toggle events from other components
    const handleToggleAudio = (e: CustomEvent) => {
      if (e.detail && e.detail.muted !== undefined) {
        setIsMuted(e.detail.muted)
        if (audioRef.current) {
          audioRef.current.muted = e.detail.muted
          if (e.detail.muted) {
            audioRef.current.pause()
          } else {
            audioRef.current.play().catch((err) => console.error("Failed to play audio:", err))
          }
        }
      }
    }

    // Listen for audio initialization events
    const handleAudioInitialized = (e: CustomEvent) => {
      hasInitialized.current = true
      audioInitializedRef.current = true
      console.log("Audio controller received initialization event")
    }

    window.addEventListener("toggle-audio", handleToggleAudio as EventListener)
    window.addEventListener("audio-initialized", handleAudioInitialized as EventListener)

    // Add click handler for playing click sounds
    const handleClick = (e: MouseEvent) => {
      if (!isMuted && hasInitialized.current) {
        playClickSound(settings.soundVolume)
      }
    }

    document.addEventListener("click", handleClick)

    // Add touch handler specifically for mobile
    const handleTouch = (e: TouchEvent) => {
      if (!isMuted && hasInitialized.current) {
        playClickSound(settings.soundVolume)
      }
    }

    document.addEventListener("touchend", handleTouch)

    return () => {
      window.removeEventListener("toggle-audio", handleToggleAudio as EventListener)
      window.removeEventListener("audio-initialized", handleAudioInitialized as EventListener)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("touchend", handleTouch)
    }
  }, [isMuted, settings.soundVolume])

  // This component doesn't render anything visible
  return null
}
