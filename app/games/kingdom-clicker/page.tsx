import { GameBackButton } from "@/components/game-back-button"
import KingdomClickerGame from "@/components/kingdom-clicker-game"
import "../app/games/kingdom-clicker/kingdom-clicker.css"

export const metadata = {
  title: "Kingdom Clicker",
  description: "Build and expand your medieval kingdom one click at a time",
}

export default function KingdomClickerPage() {
  return (
    <>
      <GameBackButton />
      <KingdomClickerGame />
    </>
  )
}
