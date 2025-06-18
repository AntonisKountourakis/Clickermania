"use client"

import { useEffect, useRef } from "react"
import { useSettings } from "@/contexts/settings-context"

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const clickSoundRef = useRef<HTMLAudioElement>(null)
  const { settings } = useSettings()

  // Update audio volume when settings change
  useEffect(() => {
    if (audioRef.current && settings) {
      audioRef.current.volume = settings.musicVolume || 0.2
      audioRef.current.muted = settings.isMuted || false
    }

    if (clickSoundRef.current && settings) {
      clickSoundRef.current.volume = settings.soundVolume || 0.5
    }
  }, [settings])

  return (
    <>
      <audio id="background-music" ref={audioRef} loop preload="auto" src="/Eternal-Click.mp3" />
      <audio id="click-sound" ref={clickSoundRef} preload="auto" src="/click-sound.mp3" />
    </>
  )
}
