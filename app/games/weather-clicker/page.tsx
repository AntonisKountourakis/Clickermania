import Link from "next/link"
import WeatherClickerGame from "@/components/weather-clicker-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./weather-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Weather Master Clicker",
  description: "Control the weather and build your forecasting empire",
}

export default function WeatherClickerPage() {
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
      <WeatherClickerGame />
      <ResetButton />
    </>
  )
}
