"use client"

import { useEffect } from "react"
import { initializeClickSounds } from "@/utils/click-sound"
import { GameBackButton } from "@/components/game-back-button"
import ClickerGame from "@/components/clicker-game"
import "./clicker.css"
import ResetButton from "@/components/reset-button"

export default function ClickerPageClient() {
  // Initialize click sounds when the page loads
  useEffect(() => {
    initializeClickSounds()
  }, [])

  return (
    <div>
      <GameBackButton />
      <ClickerGame />
      <ResetButton />
      <h1>Clicker Game</h1>
    </div>
  )
}
