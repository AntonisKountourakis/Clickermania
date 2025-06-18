import SpaceClickerGame from "@/components/space-clicker-game"
import { GameBackButton } from "@/components/game-back-button"
import "./space-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Space Explorer",
  description: "A space-themed clicker game where you explore the cosmos and expand your space empire",
}

export default function SpaceClickerPage() {
  return (
    <>
      <GameBackButton />
      <SpaceClickerGame />
      <ResetButton />
    </>
  )
}
