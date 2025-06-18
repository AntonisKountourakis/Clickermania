import { GameBackButton } from "@/components/game-back-button"
import LOTRClickerGame from "@/components/lotr-clicker-game"
import "./lotr-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Lord of the Rings Clicker",
  description: "A Middle-earth themed clicker game where you forge your destiny in the world of Lord of the Rings",
}

export default function LOTRClickerPage() {
  return (
    <>
      <GameBackButton />
      <LOTRClickerGame />
      <ResetButton />
    </>
  )
}
