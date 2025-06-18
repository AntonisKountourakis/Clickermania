import { GameBackButton } from "@/components/game-back-button"
import DinosaurClickerGame from "@/components/dinosaur-clicker-game"
import "./dinosaur-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Dinosaur Park",
  description: "A prehistoric clicker game where you build your own dinosaur park",
}

export default function DinosaurClickerPage() {
  return (
    <>
      <GameBackButton />
      <DinosaurClickerGame />
      <ResetButton />
    </>
  )
}
