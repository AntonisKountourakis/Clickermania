import { GameBackButton } from "@/components/game-back-button"
import TroyClickerGame from "@/components/troy-clicker-game"
import "./troy-clicker.css"

export const metadata = {
  title: "Troy: Battle for Glory | ClickerMania",
  description: "Conquer the ancient city of Troy in this epic clicker game",
}

export default function TroyClickerPage() {
  return (
    <div className="min-h-screen bg-amber-950 text-amber-100 m-0 p-0">
      <div className="container mx-auto p-0 pt-0 mt-0">
        <GameBackButton className="text-amber-300 hover:text-amber-100" />
        <TroyClickerGame />
      </div>
    </div>
  )
}
