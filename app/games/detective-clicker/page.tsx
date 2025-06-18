import { GameBackButton } from "@/components/game-back-button"
import { YouTubeStyleDetectiveClicker } from "@/components/youtube-style-detective-clicker"
import ResetButton from "@/components/reset-button"
import "./detective-clicker.css"

export const metadata = {
  title: "Mystery Detective Agency",
  description: "Solve cases, gather clues, and become the greatest detective",
}

export default function DetectiveClickerPage() {
  return (
    <>
      <GameBackButton />
      <YouTubeStyleDetectiveClicker />
      <ResetButton gameId="detective-clicker" />
    </>
  )
}
