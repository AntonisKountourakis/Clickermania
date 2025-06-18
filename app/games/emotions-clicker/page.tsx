import { GameBackButton } from "@/components/game-back-button"
import EmotionsClickerGame from "@/components/emotions-clicker-game"
import "./emotions-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Emotions Clicker",
  description: "A game about experiencing and collecting different emotions",
}

export default function EmotionsClickerPage() {
  return (
    <div className="m-0 p-0">
      <GameBackButton />
      <div className="m-0 p-0">
        <EmotionsClickerGame />
        <ResetButton />
      </div>
    </div>
  )
}
