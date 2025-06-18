import GreekMythologyClickerGame from "@/components/greek-mythology-clicker-game"
import "../click-optimizations.css"
import "./greek-mythology-clicker.css"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Greek Mythology Clicker - Click Games",
  description: "Collect ambrosia and gain the favor of the Olympian gods in this Greek mythology themed clicker game.",
}

export default function GreekMythologyClickerPage() {
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
      <GreekMythologyClickerGame />
    </>
  )
}
