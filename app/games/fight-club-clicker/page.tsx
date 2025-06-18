import Link from "next/link"
import FightClubClickerGame from "@/components/fight-club-clicker-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./fight-club-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Fight Club Clicker",
  description: "A clicker game inspired by the themes of Fight Club",
}

export default function FightClubClickerPage() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none hover:from-amber-500 hover:to-amber-700 hover:text-white shadow-lg"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <FightClubClickerGame />
      <ResetButton />
    </>
  )
}
