import { GameBackButton } from "@/components/game-back-button"
import YoutubeClickerGame from "@/components/youtube-clicker-game"
import "./youtube-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "YouTube Creator Clicker",
  description: "A YouTube-themed clicker game where you create content, gain views, and grow your channel",
}

export default function YouTubeClickerPage() {
  return (
    <div className="m-0 p-0">
      <GameBackButton />
      <div className="m-0 p-0">
        <YoutubeClickerGame />
        <ResetButton />
      </div>
    </div>
  )
}
