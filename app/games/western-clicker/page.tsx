import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./western-clicker.css"
import WesternClickerClient from "./WesternClickerClient"

export const metadata = {
  title: "Western Clicker",
  description: "A wild west themed clicker game where you build your frontier town",
}

export default function WesternClickerPage() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none hover:from-amber-500 hover:to-amber-700 hover:text-white shadow-lg touch-optimized"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <WesternClickerClient />
    </>
  )
}
