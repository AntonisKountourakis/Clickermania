"use client"

import { useEffect, useRef } from "react"

export function DirectAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const clickSoundRef = useRef<HTMLAudioElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    // Check if sound is muted in localStorage
    const isMuted = localStorage.getItem("audio-muted") === "true"

    // Set initial state
    if (audioRef.current) {
      audioRef.current.volume = 0.2
      audioRef.current.muted = isMuted
      audioRef.current.loop = true
    }

    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.5
      clickSoundRef.current.muted = isMuted
    }

    // Listen for sound toggle events
    const handleSoundToggle = (event: CustomEvent) => {
      const { muted } = event.detail

      if (audioRef.current) {
        audioRef.current.muted = muted

        // If unmuting and not playing, try to play
        if (!muted && audioRef.current.paused && initializedRef.current) {
          audioRef.current.play().catch((err) => {
            console.warn("Failed to play background music on toggle:", err.message)
          })
        }
      }

      if (clickSoundRef.current) {
        clickSoundRef.current.muted = muted
      }
    }

    window.addEventListener("sound-toggle", handleSoundToggle as EventListener)

    // Mark as initialized after a short delay
    const initTimeout = setTimeout(() => {
      initializedRef.current = true
    }, 1000)

    // Cleanup
    return () => {
      window.removeEventListener("sound-toggle", handleSoundToggle as EventListener)
      clearTimeout(initTimeout)
    }
  }, [])

  return (
    <>
      <audio id="background-music" ref={audioRef} preload="auto" loop data-src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eternal%20Click-Anwgv1k0uF7BxW5v73F9p6a6L1VFW5.mp3" />
      <audio id="click-sound" ref={clickSoundRef} preload="auto" data-src="/click-sound.mp3" />
    </>
  )
}
