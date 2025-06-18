import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import HolidayClickerGame from "@/components/holiday-clicker-game"
import "./holiday-clicker.css"

export default function HolidayClickerPage() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-blue-400 to-cyan-600 hover:from-blue-500 hover:to-cyan-700 text-white shadow-lg"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <HolidayClickerGame />
    </>
  )
}
