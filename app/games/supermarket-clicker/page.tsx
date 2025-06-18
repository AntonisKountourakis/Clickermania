import SupermarketClickerGame from "@/components/supermarket-clicker-game"
import "./supermarket-clicker.css"
import ResetButton from "@/components/reset-button"
import { GameBackButton } from "@/components/game-back-button"

export const metadata = {
  title: "Supermarket Clicker",
  description: "A supermarket-themed clicker game where you build your retail empire",
}

export default function SupermarketClickerPage() {
  return (
    <>
      <GameBackButton />
      <SupermarketClickerGame />
      <ResetButton />
    </>
  )
}
