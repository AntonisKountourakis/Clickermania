import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import SaltburnClickerGame from "@/components/saltburn-clicker-game"
import ResetButton from "@/components/reset-button"
import "../saltburn-clicker/saltburn-clicker.css"

export default function SaltburnClickerPage() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-gray-900/50 backdrop-blur-sm border-amber-700 text-amber-300 hover:bg-amber-900/50 hover:text-amber-100"
        >
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <ResetButton game="saltburn" />
      </div>

      <SaltburnClickerGame />
    </>
  )
}
