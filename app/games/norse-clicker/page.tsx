import NorseClickerGame from "@/components/norse-clicker-game"
import { GameBackButton } from "@/components/game-back-button"
import "./norse-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Norse Mythology Clicker",
  description: "A Viking-themed clicker game where you build your legend in Norse mythology",
}

export default function NorseClickerPage() {
  return (
    <>
      <GameBackButton />
      <NorseClickerGame />
      <ResetButton />
    </>
  )
}
