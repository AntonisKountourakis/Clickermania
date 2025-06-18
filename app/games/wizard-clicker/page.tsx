import type { Metadata } from "next"
import YouTubeStyleWizardClicker from "@/components/youtube-style-wizard-clicker"
import GameBackButton from "@/components/game-back-button"
import ResetButton from "@/components/reset-button"

export const metadata: Metadata = {
  title: "Wizard Clicker | Games Website",
  description: "Master the arcane arts and become a legendary wizard in this magical clicker game!",
}

export default function WizardClickerPage() {
  return (
    <main className="min-h-screen">
      <div className="fixed top-4 left-4 z-10 flex gap-2">
        <GameBackButton />
        <ResetButton gameId="wizard-clicker" />
      </div>
      <YouTubeStyleWizardClicker />
    </main>
  )
}
