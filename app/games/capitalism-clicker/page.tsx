import Link from "next/link"
import CapitalismClickerGame from "@/components/capitalism-clicker-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./capitalism-clicker.css"
import ResetButton from "@/components/reset-button"

export const metadata = {
  title: "Capitalism Clicker",
  description: "A money-themed clicker game where you invest and build your financial empire",
}

export default function CapitalismClickerPage() {
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
      <CapitalismClickerGame />
      <ResetButton />
    </>
  )
}
