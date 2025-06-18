import Link from "next/link"
import SweetClickerGame from "@/components/sweet-clicker-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./sweet-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Sweet Bakery Clicker",
  description: "A delicious clicker game where you bake sweets and expand your bakery",
}

export default function SweetClickerPage() {
  return (
    <div className="m-0 p-0">
      <div className="fixed top-0 left-0 z-50 m-0 p-0">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none hover:from-amber-500 hover:to-amber-700 hover:text-white shadow-lg rounded-none rounded-br-md"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="m-0 p-0">
        <SweetClickerGame />
        <ResetButton />
      </div>
    </div>
  )
}
