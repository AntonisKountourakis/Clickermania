import AviationClickerGame from "@/components/aviation-clicker-game"
import { GameBackButton } from "@/components/game-back-button"
import "@/app/games/aviation-clicker/aviation-clicker.css"

export default function AviationClickerPage() {
  return (
    <div className="relative">
      <GameBackButton className="absolute top-4 left-4 z-10" />
      <AviationClickerGame />
    </div>
  )
}
