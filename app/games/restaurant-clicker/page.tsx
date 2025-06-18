import type { Metadata } from "next"
import { GameBackButton } from "@/components/game-back-button"
import { YouTubeStyleRestaurantClicker } from "@/components/youtube-style-restaurant-clicker"

export const metadata: Metadata = {
  title: "Restaurant Clicker | Gourmet Restaurant Tycoon",
  description: "Cook delicious meals and build your culinary empire in this restaurant management clicker game",
}

export default function RestaurantClickerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-200">
      <GameBackButton />
      <YouTubeStyleRestaurantClicker />
    </div>
  )
}
