import { GameBackButton } from "@/components/game-back-button"
import CookieClickerGame from "@/components/cookie-clicker-game"
import "./cookie-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Cookie Clicker",
  description: "A classic cookie clicker game where you bake cookies and build your bakery empire",
}

export default function CookieClickerPage() {
  return (
    <>
      <GameBackButton />
      <CookieClickerGame />
      <ResetButton />
    </>
  )
}
