import Link from "next/link"
import GodfatherClickerGame from "@/components/godfather-clicker-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./godfather-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "The Godfather Clicker",
  description: "A Godfather-themed clicker game where you build your family empire and earn respect",
}

export default function GodfatherClickerPage() {
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
      <GodfatherClickerGame />
      <ResetButton />
    </>
  )
}
