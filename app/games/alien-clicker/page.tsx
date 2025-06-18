import Link from "next/link"
import AlienClickerGame from "@/components/alien-clicker-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./alien-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Alien Invasion Clicker",
  description: "Control alien technology and conquer Earth one click at a time",
}

export default function AlienClickerPage() {
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
      <AlienClickerGame />
      <ResetButton />
    </>
  )
}
