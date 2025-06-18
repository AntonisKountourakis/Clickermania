import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./zombie-clicker.css"
import ResetButton from "@/components/reset-button"
import YouTubeStyleZombieClicker from "@/components/youtube-style-zombie-clicker"

export const metadata = {
  title: "Zombie Clicker",
  description: "A post-apocalyptic clicker game where you survive the zombie outbreak",
}

export default function ZombieClickerPage() {
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
      <YouTubeStyleZombieClicker />
      <ResetButton />
    </>
  )
}
