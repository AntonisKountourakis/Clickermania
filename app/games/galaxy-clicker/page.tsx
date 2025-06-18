import { GameBackButton } from "@/components/game-back-button"
import GalaxyClickerGame from "@/components/galaxy-clicker-game"
import "./galaxy-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Galaxy Conquest",
  description: "A space-themed clicker game where you conquer the galaxy",
}

export default function GalaxyClickerPage() {
  return (
    <>
      <GameBackButton />
      <GalaxyClickerGame />
      <ResetButton />
    </>
  )
}
