"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileSoundInitializer() {
  const [isMuted, setIsMuted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Load mute preference from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedMute = localStorage.getItem("audio-muted")
      if (savedMute === "true") {
        setIsMuted(true)
      }
    } catch (e) {
      console.error("Failed to load mute preference:", e)
    }
  }, [])

  // Initialize audio on first render
  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      setIsInitialized(true)
      return
    }

    // For mobile, we'll wait for explicit user interaction
  }, [])

  const initializeAudio = () => {
    try {
      // Create AudioContext
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContext()
      }

      // Resume the audio context
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }

      // Play a silent sound to unlock audio
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      gainNode.gain.value = 0.01 // Nearly silent
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      oscillator.start(0)
      oscillator.stop(audioContextRef.current.currentTime + 0.1)

      // Initialize HTML audio elements
      const backgroundMusic = document.getElementById("background-music") as HTMLAudioElement
      if (backgroundMusic) {
        backgroundMusic.volume = 0.5
        backgroundMusic.muted = isMuted
        const playPromise = backgroundMusic.play()
        if (playPromise) {
          playPromise.catch((e) => console.log("Background music init failed:", e))
        }
      }

      const clickSound = document.getElementById("click-sound") as HTMLAudioElement
      if (clickSound) {
        clickSound.load()
        clickSound.volume = 0.5
        clickSound.muted = isMuted
        clickSound
          .play()
          .then(() => {
            clickSound.pause()
            clickSound.currentTime = 0
          })
          .catch((e) => console.log("Click sound init failed:", e))
      }
      // Set global audio context for click sounds
      ;(window as any).gameAudioContext = audioContextRef.current

      // Mark as initialized
      setIsInitialized(true)

      // Dispatch event to notify other components
      const event = new CustomEvent("audio-initialized", {
        detail: { initialized: true, muted: isMuted },
      })
      window.dispatchEvent(event)

      console.log("Audio successfully initialized on mobile")
    } catch (err) {
      console.error("Failed to initialize audio:", err)
    }
  }

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    // Update localStorage
    localStorage.setItem("audio-muted", newMutedState ? "true" : "false")

    // Update audio elements
    const backgroundMusic = document.getElementById("background-music") as HTMLAudioElement
    if (backgroundMusic) {
      backgroundMusic.muted = newMutedState
      if (newMutedState) {
        backgroundMusic.pause()
      } else {
        backgroundMusic.play().catch((e) => console.log("Failed to play after unmute:", e))
      }
    }

    // Notify other components
    const event = new CustomEvent("toggle-audio", {
      detail: { muted: newMutedState },
    })
    window.dispatchEvent(event)
  }

  // Only show on mobile devices
  if (typeof navigator !== "undefined" && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    return null
  }

  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
      {!isInitialized && (
        <Button
          onClick={initializeAudio}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg animate-pulse"
        >
          Tap to Enable Sound
        </Button>
      )}

      {isInitialized && (
        <Button
          onClick={toggleMute}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-purple-600/90 border-white/20 text-white hover:bg-purple-700"
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
      )}
    </div>
  )
}
